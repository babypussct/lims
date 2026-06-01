$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$filePath = "C:\Users\GCMS\Documents\GitHub\lims\Report_ISTD_PARAMETER_NEW.xlsx"
$workbook = $excel.Workbooks.Open($filePath)

$sheetsToInspect = @("Compound", "FIPRONIL", "FIPRONIL DESULFINYL")

foreach ($sheetName in $sheetsToInspect) {
    $sheet = $workbook.Sheets.Item($sheetName)
    if ($sheet) {
        Write-Host "`n=================================================="
        Write-Host "--- First 40 rows of sheet '$sheetName' ---"
        Write-Host "=================================================="
        for ($r = 1; $r -le 40; $r++) {
            $rowValues = @()
            for ($c = 1; $c -le 15; $c++) {
                $val = $sheet.Cells.Item($r, $c).Text
                $rowValues += "'$val'"
            }
            $rowNum = $r
            $rowStr = $rowValues -join ', '
            Write-Host "Row $rowNum : $rowStr"
        }
    }
}

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
