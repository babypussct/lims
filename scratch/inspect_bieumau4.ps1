$filesToInspect = Get-ChildItem -Path "c:\Users\GCMS\Documents\GitHub\lims\FILEBIEUMAUGOC" -Filter "*.docx" | Select-Object -ExpandProperty Name

foreach ($filename in $filesToInspect) {
    if ($filename.StartsWith("~$")) { continue } # skip word temp files
    $xmlPath = "c:\Users\GCMS\Documents\GitHub\lims\FILEBIEUMAUGOC\$filename"
    $tempDir = Join-Path "c:\Users\GCMS\Documents\GitHub\lims" "temp_inspect_$($filename.Replace('.', '_').Replace(' ', '_'))"
    if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    try {
        [System.IO.Compression.ZipFile]::ExtractToDirectory($xmlPath, $tempDir)
    } catch {
        Write-Host "Error extracting ${filename}: $_"
        continue
    }
    $xmlPath = Join-Path $tempDir "word\document.xml"
    
    Write-Host "`n========================================================"
    Write-Host "FILE: $filename"
    Write-Host "========================================================"



# Read XML content
$xmlContent = Get-Content -Path $xmlPath -Raw -Encoding UTF8

# Extract all <w:t> tags using regex
$tMatches = [regex]::Matches($xmlContent, '<w:t[^>]*>([^<]*)</w:t>')
$texts = @()
foreach ($match in $tMatches) {
    $texts += $match.Groups[1].Value
}

Write-Host "=== Title / First Texts ==="
$combined = $texts -join " "
Write-Host ($combined.Substring(0, [Math]::Min(500, $combined.Length)))

# Find placeholders
$placeholders = [regex]::Matches($combined, '\{\{[^}]+\}\}') | ForEach-Object { $_.Value } | Select-Object -Unique
if ($placeholders.Count -gt 0) {
    Write-Host "Placeholders: $($placeholders -join ', ')"
} else {
    Write-Host "Placeholders: NONE"
}

# Find tables
$tblMatches = [regex]::Matches($xmlContent, '<w:tbl[\s\S]*?</w:tbl>')
Write-Host "Total tables: $($tblMatches.Count)"

for ($tIdx = 0; $tIdx -lt $tblMatches.Count; $tIdx++) {
    $tblXml = $tblMatches[$tIdx].Value
    $trMatches = [regex]::Matches($tblXml, '<w:tr[\s\S]*?</w:tr>')
    Write-Host "  Table ${tIdx}: $($trMatches.Count) rows"
}

if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
}

