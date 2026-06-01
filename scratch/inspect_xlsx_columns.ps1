$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$filePath = "C:\Users\GCMS\Documents\GitHub\lims\Report_ISTD_PARAMETER_NEW.xlsx"
$workbook = $excel.Workbooks.Open($filePath)

$sheet = $workbook.Sheets.Item("FIPRONIL")

Write-Host "--- Columns in Row 10 (Header) ---"
for ($c = 1; $c -le 40; $c++) {
    $headerVal = $sheet.Cells.Item(10, $c).Text
    if ($headerVal) {
        Write-Host "Col $c : '$headerVal'"
    }
}

Write-Host "`n--- Row 11 (First calibration sample data) ---"
for ($c = 1; $c -le 40; $c++) {
    $val = $sheet.Cells.Item(11, $c).Text
    $headerVal = $sheet.Cells.Item(10, $c).Text
    if ($val -or $headerVal) {
        Write-Host "Col $c ($headerVal): '$val'"
    }
}

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
