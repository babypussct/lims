$files = @("filebieumau3.docx", "filebieumau4.docx")
foreach ($f in $files) {
    $zip = "c:\Users\GCMS\Documents\GitHub\lims\FILEBIEUMAUGOC\$f"
    $temp = Join-Path "c:\Users\GCMS\Documents\GitHub\lims" "temp_check34"
    if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
    New-Item -ItemType Directory -Path $temp -Force | Out-Null
    
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $temp)
    
    $xml = Get-Content -Path (Join-Path $temp "word\document.xml") -Raw -Encoding UTF8
    $matches = [regex]::Matches($xml, '<w:t[^>]*>([^<]*)</w:t>')
    $txt = @()
    foreach ($m in $matches) {
        $txt += $m.Groups[1].Value
    }
    $combined = $txt -join " "
    
    Write-Host "========================================="
    Write-Host "FILE: $f"
    Write-Host "Title: $($combined.Substring(0, 300))"
    
    $tblMatches = [regex]::Matches($xml, '<w:tbl[\s\S]*?</w:tbl>')
    Write-Host "Tables Count: $($tblMatches.Count)"
    
    for ($t = 0; $t -lt $tblMatches.Count; $t++) {
        $tblXml = $tblMatches[$t].Value
        $trMatches = [regex]::Matches($tblXml, '<w:tr[\s\S]*?</w:tr>')
        Write-Host "  Table ${t}: $($trMatches.Count) rows"
        # Print first row
        if ($trMatches.Count -gt 0) {
            $tcMatches = [regex]::Matches($trMatches[0].Value, '<w:tc[\s\S]*?</w:tc>')
            $cells = @()
            foreach ($tc in $tcMatches) {
                $cellText = ([regex]::Matches($tc.Value, '<w:t[^>]*>([^<]*)</w:t>') | ForEach-Object { $_.Groups[1].Value }) -join ""
                $cells += $cellText.Trim()
            }
            Write-Host "    Row 0: [ $(($cells | ForEach-Object { "'$_'" }) -join ' | ') ]"
        }
    }
    
    Remove-Item $temp -Recurse -Force
}
