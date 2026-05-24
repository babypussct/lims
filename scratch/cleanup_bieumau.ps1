# PowerShell script to clean up LIMS root directory
# Moves all template-related files and extracted directories into a folder named FILEBIEUMAUGOC

$ErrorActionPreference = "Continue"

$workspace = "C:\Users\GCMS\Documents\GitHub\lims"
$targetDir = Join-Path $workspace "FILEBIEUMAUGOC"

# 1. Create target folder if it doesn't exist
if (-not (Test-Path $targetDir)) {
    New-Item -Path $targetDir -ItemType Directory -Force
    Write-Host "Created folder: $targetDir"
}

# 2. Define items to move (both files and directories)
$itemsToMove = @(
    # filebieumau documents and folders
    "*filebieumau*",
    # original templates
    "*FORM_GOC*",
    # generated test output files and folders
    "TEST_OUTPUT.docx",
    "TEST_REPORT_OUTPUT.docx",
    "KQ_fipronil-chlorpyrifos*",
    "temp_extract"
)

# 3. Move items
foreach ($pattern in $itemsToMove) {
    # Find matching items in workspace root (excluding the target directory itself)
    $matches = Get-ChildItem -Path $workspace -Filter $pattern | Where-Object { $_.FullName -ne $targetDir }
    
    foreach ($item in $matches) {
        $destPath = Join-Path $targetDir $item.Name
        Write-Host "Moving '$($item.Name)' to '$destPath'..."
        
        try {
            if (Test-Path $destPath) {
                # If destination already exists, remove it first to avoid collision
                Remove-Item -Path $destPath -Recurse -Force
            }
            Move-Item -Path $item.FullName -Destination $targetDir -Force
        } catch {
            Write-Host "Warning: Could not move $($item.Name). Error: $_"
        }
    }
}

Write-Host "Cleanup completed successfully!"
