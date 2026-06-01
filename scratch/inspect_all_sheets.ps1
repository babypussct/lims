$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$filePath = "C:\Users\GCMS\Documents\GitHub\lims\Report_ISTD_PARAMETER_NEW.xlsx"
$workbook = $excel.Workbooks.Open($filePath)

Write-Host "All sheets in the Excel file:"
foreach ($sheet in $workbook.Sheets) {
    Write-Host " - Name: '$($sheet.Name)'"
}

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
