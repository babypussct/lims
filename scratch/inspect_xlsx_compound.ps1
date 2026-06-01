$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$filePath = "C:\Users\GCMS\Documents\GitHub\lims\Report_ISTD_PARAMETER_NEW.xlsx"
$workbook = $excel.Workbooks.Open($filePath)

$sheet = $workbook.Sheets.Item("Compound")

Write-Host "--- First 20 rows of sheet 'Compound' ---"
for ($r = 1; $r -le 20; $r++) {
    $rowValues = @()
    for ($c = 1; $c -le 10; $c++) {
        $val = $sheet.Cells.Item($r, $c).Text
        $rowValues += "'$val'"
    }
    $rowNum = $r
    $rowStr = $rowValues -join ', '
    Write-Host "Row $rowNum : $rowStr"
}

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
