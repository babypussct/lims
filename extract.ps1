$src = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\src\app\features\results\sops\sop-lan-huu-co\sop-lan-huu-co-entry.component.ts')

$htmlStart = $src.IndexOf('<!-- TAB 2: CALIBRATION CURVE & SAMPLE RUNS -->')
$htmlEnd = $src.IndexOf('  `', $htmlStart)
[System.IO.File]::WriteAllText('c:\Users\GCMS\Documents\GitHub\lims\scratch_html2.txt', $src.Substring($htmlStart, $htmlEnd - $htmlStart))

$tsStart = $src.IndexOf('setPrintFormType(type:')
$tsEnd = $src.IndexOf('getChromatographyRows(): any[] {', $tsStart)
$tsEnd2 = $src.IndexOf('}', $src.IndexOf('return list;', $tsEnd)) + 1
[System.IO.File]::WriteAllText('c:\Users\GCMS\Documents\GitHub\lims\scratch_ts.txt', $src.Substring($tsStart, $tsEnd2 - $tsStart))

$tsInitStart = $src.IndexOf('    // Initialize printFormType')
$tsInitEnd = $src.IndexOf('    // Set default value for loaiMau')
[System.IO.File]::WriteAllText('c:\Users\GCMS\Documents\GitHub\lims\scratch_ts_init.txt', $src.Substring($tsInitStart, $tsInitEnd - $tsInitStart))
