$content = Get-Content -Path 'c:\Users\GCMS\Documents\GitHub\lims\src\app\features\results\result-pdf-helper.ts' -Raw
$content = $content.Replace("'KPH'", "'N/A'")
Set-Content -Path 'c:\Users\GCMS\Documents\GitHub\lims\src\app\features\results\result-pdf-helper.ts' -Value $content -Encoding UTF8
