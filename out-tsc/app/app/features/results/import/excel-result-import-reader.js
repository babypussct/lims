import { getRelevantExcelImportSheetNames, parseMassHunterResultWorkbook } from './excel-result-import';
class WorkerUnavailableError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'WorkerUnavailableError';
    }
}
export async function readExcelResultFile(file, context, onProgress, signal) {
    const buffer = await readFileAsArrayBuffer(file, onProgress, signal);
    throwIfAborted(signal);
    if (typeof Worker !== 'undefined') {
        try {
            return await readInWorker(buffer, context, onProgress, signal);
        }
        catch (error) {
            if (isAbortError(error) || !(error instanceof WorkerUnavailableError))
                throw error;
            console.warn('[Excel result import] Worker unavailable, using main-thread fallback', error);
            onProgress({
                stage: 'fallback',
                percent: 28,
                message: 'Trình duyệt không hỗ trợ worker; đang chuyển sang chế độ tương thích...'
            });
            const retryBuffer = buffer.byteLength > 0
                ? buffer
                : await readFileAsArrayBuffer(file, onProgress, signal);
            return readOnMainThread(retryBuffer, context, onProgress, signal);
        }
    }
    onProgress({
        stage: 'fallback',
        percent: 28,
        message: 'Đang sử dụng chế độ đọc tương thích của trình duyệt...'
    });
    return readOnMainThread(buffer, context, onProgress, signal);
}
function readInWorker(buffer, context, onProgress, signal) {
    return new Promise((resolve, reject) => {
        let worker;
        try {
            worker = new Worker(new URL('./excel-result-import.worker', import.meta.url), { type: 'module' });
        }
        catch (error) {
            reject(new WorkerUnavailableError(String(error)));
            return;
        }
        const cleanup = () => {
            signal?.removeEventListener('abort', handleAbort);
            worker.terminate();
        };
        const handleAbort = () => {
            cleanup();
            reject(createAbortError());
        };
        worker.addEventListener('error', event => {
            cleanup();
            reject(new WorkerUnavailableError(event.message || 'Không khởi động được Excel worker.'));
        });
        worker.addEventListener('message', ({ data }) => {
            if (data.type === 'progress') {
                onProgress({
                    stage: data.percent && data.percent >= 50 ? 'parsing-data' : 'reading-sheets',
                    percent: data.percent || 30,
                    message: data.message || 'Đang đọc dữ liệu Excel...'
                });
                return;
            }
            if (data.type === 'sheet-names') {
                const allSheetNames = data.sheetNames || [];
                const relevantSheetNames = getRelevantExcelImportSheetNames(allSheetNames, context);
                const selectedSheetNames = relevantSheetNames.length > 0
                    ? relevantSheetNames
                    : allSheetNames;
                const skippedCount = Math.max(0, allSheetNames.length - selectedSheetNames.length);
                onProgress({
                    stage: 'reading-sheets',
                    percent: 45,
                    message: relevantSheetNames.length > 0
                        ? `Đã chọn ${selectedSheetNames.length} sheet kết quả; bỏ qua ${skippedCount} sheet không liên quan và toàn bộ hình/chart.`
                        : 'Chưa nhận diện được sheet theo SOP; đang kiểm tra toàn bộ sheet dữ liệu.'
                });
                worker.postMessage({ type: 'parse', sheetNames: selectedSheetNames });
                return;
            }
            if (data.type === 'error') {
                cleanup();
                const error = new Error(data.message || 'Không đọc được workbook Excel.');
                error.name = data.name || 'ExcelWorkbookParseError';
                reject(error);
                return;
            }
            if (!data.parsed) {
                cleanup();
                reject(new Error('Excel worker không trả về dữ liệu kết quả.'));
                return;
            }
            onProgress({
                stage: 'matching-data',
                percent: 90,
                message: 'Đã đọc xong Excel; đang ghép số liệu với mẫu trong mẻ...'
            });
            const parsed = data.parsed;
            cleanup();
            resolve(parsed);
        });
        signal?.addEventListener('abort', handleAbort, { once: true });
        if (signal?.aborted) {
            handleAbort();
            return;
        }
        worker.postMessage({ type: 'open', buffer }, [buffer]);
    });
}
async function readOnMainThread(buffer, context, onProgress, signal) {
    throwIfAborted(signal);
    const XLSX = await import('xlsx');
    await yieldToBrowser();
    throwIfAborted(signal);
    const workbookIndex = XLSX.read(buffer, {
        type: 'array',
        bookSheets: true,
        cellFormula: false,
        cellHTML: false,
        cellStyles: false,
        bookDeps: false,
        bookFiles: false,
        bookVBA: false
    });
    const allSheetNames = workbookIndex.SheetNames || [];
    const relevantSheetNames = getRelevantExcelImportSheetNames(allSheetNames, context);
    const selectedSheetNames = relevantSheetNames.length > 0
        ? relevantSheetNames
        : allSheetNames;
    onProgress({
        stage: 'parsing-data',
        percent: 52,
        message: `Đang đọc dữ liệu từ ${selectedSheetNames.length} sheet kết quả...`
    });
    await yieldToBrowser();
    throwIfAborted(signal);
    const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: false,
        cellText: true,
        cellFormula: false,
        cellHTML: false,
        cellNF: false,
        cellStyles: false,
        sheetStubs: false,
        bookDeps: false,
        bookFiles: false,
        bookVBA: false,
        sheets: selectedSheetNames
    });
    throwIfAborted(signal);
    onProgress({
        stage: 'matching-data',
        percent: 90,
        message: 'Đã đọc xong Excel; đang ghép số liệu với mẫu trong mẻ...'
    });
    return parseMassHunterResultWorkbook(XLSX, workbook);
}
function readFileAsArrayBuffer(file, onProgress, signal) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const handleAbort = () => reader.abort();
        const cleanup = () => signal?.removeEventListener('abort', handleAbort);
        reader.onerror = () => {
            cleanup();
            reject(reader.error || new Error('Không đọc được nội dung tệp Excel.'));
        };
        reader.onabort = () => {
            cleanup();
            reject(createAbortError());
        };
        reader.onprogress = event => {
            const ratio = event.lengthComputable && event.total > 0
                ? event.loaded / event.total
                : 0;
            onProgress({
                stage: 'reading-file',
                percent: 5 + Math.round(ratio * 20),
                message: 'Đang nạp tệp Excel cục bộ...'
            });
        };
        reader.onload = () => {
            cleanup();
            if (!(reader.result instanceof ArrayBuffer)) {
                reject(new Error('Trình duyệt trả về dữ liệu Excel không hợp lệ.'));
                return;
            }
            onProgress({
                stage: 'reading-file',
                percent: 25,
                message: 'Đã nạp tệp; đang khởi động bộ đọc dữ liệu nhẹ...'
            });
            resolve(reader.result);
        };
        signal?.addEventListener('abort', handleAbort, { once: true });
        if (signal?.aborted) {
            reject(createAbortError());
            return;
        }
        reader.readAsArrayBuffer(file);
    });
}
function yieldToBrowser() {
    return new Promise(resolve => setTimeout(resolve, 0));
}
function throwIfAborted(signal) {
    if (signal?.aborted)
        throw createAbortError();
}
function createAbortError() {
    return new DOMException('Đã hủy đọc tệp Excel.', 'AbortError');
}
function isAbortError(error) {
    return error instanceof DOMException && error.name === 'AbortError';
}
//# sourceMappingURL=excel-result-import-reader.js.map