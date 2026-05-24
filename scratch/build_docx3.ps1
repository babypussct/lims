# PowerShell script to prepare directories, call node cleanup, and build filebieumau3_FORM_CLEAN.docx

$ErrorActionPreference = "Stop"

$workspace = "C:\Users\GCMS\Documents\GitHub\lims"
$srcExtracted = Join-Path $workspace "filebieumau3_extracted"
$destExtracted = Join-Path $workspace "filebieumau3_FORM_CLEAN_extracted"
$destDocx = Join-Path $workspace "filebieumau3_FORM_CLEAN.docx"
$nodeExe = "C:\Users\GCMS\AppData\Local\ms-playwright-go\1.57.0\node.exe"
$cleanupScript = Join-Path $workspace "scratch\clean_document3.js"

Write-Host "1. Cleaning up existing destination extracted folder..."
if (Test-Path $destExtracted) {
    Remove-Item -Path $destExtracted -Recurse -Force
}

Write-Host "2. Copying source extracted folder to destination..."
Copy-Item -Path $srcExtracted -Destination $destExtracted -Recurse -Force

Write-Host "3. Running Node.js cleanup script..."
& $nodeExe $cleanupScript

Write-Host "4. Zipping the extracted files into the target docx file..."
if (Test-Path $destDocx) {
    Remove-Item -Path $destDocx -Force
}
$tempZip = Join-Path $workspace "filebieumau3_FORM_CLEAN.zip"
if (Test-Path $tempZip) {
    Remove-Item -Path $tempZip -Force
}

# Use .NET ZipFile to correctly preserve internal folder structure (required for valid .docx)
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($destExtracted, $tempZip)

# Rename/move .zip to .docx
Move-Item -Path $tempZip -Destination $destDocx -Force

Write-Host "Successfully created $destDocx"
