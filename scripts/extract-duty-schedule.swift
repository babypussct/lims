import AppKit
import Foundation
import Vision

private struct OCRLine {
    let x: CGFloat
    let y: CGFloat
    let text: String
}

private struct DutyBlock {
    let dayRange: ClosedRange<Int>
    let rowY: [CGFloat]
    let xIntercept: CGFloat
    let xSlope: CGFloat

    func xPosition(for day: Int) -> CGFloat {
        xIntercept + xSlope * CGFloat(day)
    }
}

private func parseMonthYear(_ filename: String) -> (month: Int, year: Int)? {
    let pattern = #"^t(\d{1,2})\s+(\d{4})\.jpg$"#
    guard
        let regex = try? NSRegularExpression(pattern: pattern),
        let match = regex.firstMatch(
            in: filename,
            range: NSRange(filename.startIndex..., in: filename)
        ),
        let monthRange = Range(match.range(at: 1), in: filename),
        let yearRange = Range(match.range(at: 2), in: filename),
        let month = Int(filename[monthRange]),
        let year = Int(filename[yearRange])
    else {
        return nil
    }

    return (month, year)
}

private func weekdayRow(year: Int, month: Int, day: Int) -> Int? {
    var components = DateComponents()
    components.calendar = Calendar(identifier: .gregorian)
    components.timeZone = TimeZone(identifier: "Asia/Ho_Chi_Minh")
    components.year = year
    components.month = month
    components.day = day

    guard let date = components.date, let calendar = components.calendar else {
        return nil
    }

    let resolved = calendar.dateComponents([.year, .month, .day], from: date)
    guard resolved.year == year, resolved.month == month, resolved.day == day else {
        return nil
    }

    switch calendar.component(.weekday, from: date) {
    case 2: return 0
    case 3: return 1
    case 4: return 2
    case 5: return 3
    case 6: return 4
    default: return nil
    }
}

private func observations(from path: String) throws -> [VNRecognizedTextObservation] {
    guard let image = NSImage(contentsOfFile: path) else {
        throw NSError(
            domain: "DutyScheduleOCR",
            code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Không mở được ảnh: \(path)"]
        )
    }

    var rect = NSRect(origin: .zero, size: image.size)
    guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
        throw NSError(
            domain: "DutyScheduleOCR",
            code: 2,
            userInfo: [NSLocalizedDescriptionKey: "Không tạo được CGImage: \(path)"]
        )
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["vi-VN", "en-US"]

    let orientation: CGImagePropertyOrientation = cgImage.width < cgImage.height ? .left : .up
    let handler = VNImageRequestHandler(cgImage: cgImage, orientation: orientation)
    try handler.perform([request])
    return request.results ?? []
}

private func normalized(_ text: String) -> String {
    text
        .folding(options: [.diacriticInsensitive, .caseInsensitive], locale: Locale(identifier: "vi_VN"))
        .lowercased()
}

private func weekdayLabelRow(_ text: String) -> Int? {
    let folded = normalized(text)
    guard folded.hasPrefix("th") else {
        return nil
    }

    guard let digit = folded.first(where: { "23456".contains($0) }),
          let value = Int(String(digit))
    else {
        return nil
    }

    return value - 2
}

private func integerText(_ text: String) -> Int? {
    let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
    guard trimmed.range(of: #"^\d{1,2}$"#, options: .regularExpression) != nil else {
        return nil
    }
    return Int(trimmed)
}

private func readLines(from path: String) throws -> [OCRLine] {
    try observations(from: path).compactMap { observation in
        guard let candidate = observation.topCandidates(1).first else {
            return nil
        }
        let text = candidate.string.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else {
            return nil
        }
        return OCRLine(
            x: observation.boundingBox.midX,
            y: observation.boundingBox.midY,
            text: text
        )
    }
}

private func splitRowLabels(_ labels: [(row: Int, y: CGFloat)]) -> [[(row: Int, y: CGFloat)]] {
    guard labels.count >= 4 else {
        return []
    }

    var high = labels.map(\.y).max() ?? 0.75
    var low = labels.map(\.y).min() ?? 0.35

    for _ in 0..<8 {
        let highGroup = labels.filter { abs($0.y - high) <= abs($0.y - low) }
        let lowGroup = labels.filter { abs($0.y - high) > abs($0.y - low) }
        if !highGroup.isEmpty {
            high = highGroup.map(\.y).reduce(0, +) / CGFloat(highGroup.count)
        }
        if !lowGroup.isEmpty {
            low = lowGroup.map(\.y).reduce(0, +) / CGFloat(lowGroup.count)
        }
    }

    let first = labels.filter { abs($0.y - high) <= abs($0.y - low) }
    let second = labels.filter { abs($0.y - high) > abs($0.y - low) }
    return [first, second].sorted {
        ($0.map(\.y).reduce(0, +) / CGFloat(max(1, $0.count))) >
        ($1.map(\.y).reduce(0, +) / CGFloat(max(1, $1.count)))
    }
}

private func fitRows(_ labels: [(row: Int, y: CGFloat)]) -> [CGFloat]? {
    guard labels.count >= 2 else {
        return nil
    }

    let count = CGFloat(labels.count)
    let meanX = labels.map { CGFloat($0.row) }.reduce(0, +) / count
    let meanY = labels.map(\.y).reduce(0, +) / count
    let numerator = labels.reduce(CGFloat.zero) {
        $0 + (CGFloat($1.row) - meanX) * ($1.y - meanY)
    }
    let denominator = labels.reduce(CGFloat.zero) {
        $0 + pow(CGFloat($1.row) - meanX, 2)
    }
    guard denominator > 0 else {
        return nil
    }

    let slope = numerator / denominator
    let intercept = meanY - slope * meanX
    guard slope < -0.015, slope > -0.09 else {
        return nil
    }
    return (0..<5).map { intercept + slope * CGFloat($0) }
}

private func fitXModel(
    lines: [OCRLine],
    dayRange: ClosedRange<Int>,
    headerY: CGFloat
) -> (intercept: CGFloat, slope: CGFloat)? {
    let pairs = lines.compactMap { line -> (day: Int, x: CGFloat)? in
        guard
            line.x > 0.12,
            line.y > headerY - 0.025,
            line.y < headerY + 0.08,
            let day = integerText(line.text),
            dayRange.contains(day)
        else {
            return nil
        }
        return (day, line.x)
    }

    guard pairs.count >= 2 else {
        return nil
    }

    let count = CGFloat(pairs.count)
    let meanDay = pairs.map { CGFloat($0.day) }.reduce(0, +) / count
    let meanX = pairs.map(\.x).reduce(0, +) / count
    let numerator = pairs.reduce(CGFloat.zero) {
        $0 + (CGFloat($1.day) - meanDay) * ($1.x - meanX)
    }
    let denominator = pairs.reduce(CGFloat.zero) {
        $0 + pow(CGFloat($1.day) - meanDay, 2)
    }
    guard denominator > 0 else {
        return nil
    }

    let slope = numerator / denominator
    guard slope > 0.025, slope < 0.08 else {
        return nil
    }
    return (meanX - slope * meanDay, slope)
}

private func buildBlocks(lines: [OCRLine]) -> [DutyBlock] {
    let labels = lines.compactMap { line -> (row: Int, y: CGFloat)? in
        guard line.x < 0.16, let row = weekdayLabelRow(line.text) else {
            return nil
        }
        return (row, line.y)
    }

    let labelGroups = splitRowLabels(labels)
    guard labelGroups.count == 2 else {
        return []
    }

    let ranges = [1...16, 17...31]
    var blocks: [DutyBlock] = []
    for (index, group) in labelGroups.enumerated() {
        guard let rowY = fitRows(group) else {
            continue
        }

        let headerY = rowY[0] + abs(rowY[1] - rowY[0])
        let range = ranges[index]
        let fitted = fitXModel(lines: lines, dayRange: range, headerY: headerY)

        let fallbackSlope: CGFloat = 0.052
        let fallbackIntercept: CGFloat = index == 0 ? 0.082 : (0.178 - fallbackSlope * 17)
        blocks.append(DutyBlock(
            dayRange: range,
            rowY: rowY,
            xIntercept: fitted?.intercept ?? fallbackIntercept,
            xSlope: fitted?.slope ?? fallbackSlope
        ))
    }

    return blocks
}

private func isNoise(_ text: String) -> Bool {
    let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty {
        return true
    }
    if trimmed.range(of: #"^[\d\s:;.,/()-]+$"#, options: .regularExpression) != nil {
        return true
    }

    let folded = normalized(trimmed)
    return folded.contains("lich truc")
        || folded.contains("truong phong")
        || folded.contains("thoi gian truc")
        || folded.contains("luu y")
}

private func extractCells(
    from path: String,
    month: Int,
    year: Int
) throws -> [Int: [(y: CGFloat, x: CGFloat, text: String)]] {
    let lines = try readLines(from: path)
    let blocks = buildBlocks(lines: lines)
    var grouped: [Int: [(y: CGFloat, x: CGFloat, text: String)]] = [:]

    for line in lines {
        if line.x < 0.14 || isNoise(line.text) {
            continue
        }

        guard
            let rowMatch = blocks.flatMap({ block in
                block.rowY.enumerated().map {
                    (block: block, row: $0.offset, distance: abs(line.y - $0.element))
                }
            }).min(by: { $0.distance < $1.distance }),
            rowMatch.distance <= 0.04
        else {
            continue
        }

        let candidateDays = rowMatch.block.dayRange.filter {
            weekdayRow(year: year, month: month, day: $0) == rowMatch.row
        }

        guard
            let day = candidateDays.min(by: {
                abs(line.x - rowMatch.block.xPosition(for: $0))
                    < abs(line.x - rowMatch.block.xPosition(for: $1))
            }),
            abs(line.x - rowMatch.block.xPosition(for: day))
                <= max(0.11, rowMatch.block.xSlope * 2.4)
        else {
            continue
        }

        grouped[day, default: []].append((line.y, line.x, line.text))
    }

    return grouped
}

private func main() throws {
    guard CommandLine.arguments.count >= 2 else {
        fputs(
            "Usage: swift scripts/extract-duty-schedule.swift <image-folder>\n" +
            "       swift scripts/extract-duty-schedule.swift --raw <image-path>\n",
            stderr
        )
        exit(2)
    }

    if CommandLine.arguments[1] == "--raw" {
        guard CommandLine.arguments.count >= 3 else {
            fputs("Thiếu đường dẫn ảnh cho --raw\n", stderr)
            exit(2)
        }

        for line in try readLines(from: CommandLine.arguments[2]).sorted(by: {
            if abs($0.y - $1.y) > 0.008 {
                return $0.y > $1.y
            }
            return $0.x < $1.x
        }) {
            print(
                String(
                    format: "%.4f\t%.4f\t%@",
                    Double(line.y),
                    Double(line.x),
                    line.text
                )
            )
        }
        return
    }

    let folder = CommandLine.arguments[1]
    let fileManager = FileManager.default
    let files = try fileManager.contentsOfDirectory(atPath: folder)
        .filter { $0.lowercased().hasSuffix(".jpg") }
        .sorted()

    for filename in files {
        guard let parts = parseMonthYear(filename) else {
            continue
        }

        let path = URL(fileURLWithPath: folder)
            .appendingPathComponent(filename)
            .path
        let grouped = try extractCells(
            from: path,
            month: parts.month,
            year: parts.year
        )

        print("### \(filename)")
        for day in grouped.keys.sorted() {
            let values = grouped[day, default: []]
                .sorted {
                    if abs($0.y - $1.y) > 0.008 {
                        return $0.y > $1.y
                    }
                    return $0.x < $1.x
                }
                .map(\.text)

            print(
                String(
                    format: "%04d-%02d-%02d\t%@",
                    parts.year,
                    parts.month,
                    day,
                    values.joined(separator: " | ")
                )
            )
        }
    }
}

do {
    try main()
} catch {
    fputs("OCR failed: \(error.localizedDescription)\n", stderr)
    exit(1)
}
