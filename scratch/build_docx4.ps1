$ErrorActionPreference = "Stop"

$workspace = "C:\Users\GCMS\Documents\GitHub\lims"
$srcExtracted = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau4_extracted"
$destCleanExtracted = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau4_FORM_CLEAN_extracted"
$destTrangExtracted = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau4_FORM_TRANG_extracted"

$destCleanDocx = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau_FORM_CLEAN4.docx"
$destTrangDocx = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau_FORM_TRANG4.docx"

$nodeExe = "C:\Users\GCMS\AppData\Local\ms-playwright-go\1.57.0\node.exe"
$cleanupScript = Join-Path $workspace "scratch\clean_document4.js"

Write-Host "1. Cleaning up existing destination extracted folders..."
if (Test-Path $destCleanExtracted) { Remove-Item -Path $destCleanExtracted -Recurse -Force }
if (Test-Path $destTrangExtracted) { Remove-Item -Path $destTrangExtracted -Recurse -Force }

Write-Host "2. Copying source extracted folders..."
Copy-Item -Path $srcExtracted -Destination $destCleanExtracted -Recurse -Force
Copy-Item -Path $srcExtracted -Destination $destTrangExtracted -Recurse -Force

Write-Host "3. Running Node.js dual cleanup script..."
& $nodeExe $cleanupScript

# Use .NET ZipFile to preserve internal folder structure
Add-Type -AssemblyName System.IO.Compression.FileSystem

Write-Host "4. Packaging filebieumau_FORM_CLEAN4.docx..."
if (Test-Path $destCleanDocx) { Remove-Item -Path $destCleanDocx -Force }
$tempCleanZip = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau_FORM_CLEAN4.zip"
if (Test-Path $tempCleanZip) { Remove-Item -Path $tempCleanZip -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($destCleanExtracted, $tempCleanZip)
Move-Item -Path $tempCleanZip -Destination $destCleanDocx -Force
Write-Host "Successfully created $destCleanDocx"

Write-Host "5. Packaging filebieumau_FORM_TRANG4.docx..."
if (Test-Path $destTrangDocx) { Remove-Item -Path $destTrangDocx -Force }
$tempTrangZip = Join-Path $workspace "FILEBIEUMAUGOC\filebieumau_FORM_TRANG4.zip"
if (Test-Path $tempTrangZip) { Remove-Item -Path $tempTrangZip -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($destTrangExtracted, $tempTrangZip)
Move-Item -Path $tempTrangZip -Destination $destTrangDocx -Force
Write-Host "Successfully created $destTrangDocx"
