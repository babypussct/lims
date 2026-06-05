$lan = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\gas\Report_LanHuuCo.gs', [System.Text.Encoding]::UTF8)
$start = $lan.IndexOf('function fillLanHuuCoSection2')
$end = $lan.IndexOf('function cleanLanHuuCoLastPageBreak', $start)
$func = $lan.Substring($start, $end - $start)
$func = $func.Replace('fillLanHuuCoSection2', 'fillChlorHuuCoSection2')

$mapStart = $func.IndexOf('function mapCompoundToKey(cName)')
$mapEnd = $func.IndexOf('return cName;', $mapStart) + 13

$chlor = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\gas\Report_ChlorHuuCo.gs', [System.Text.Encoding]::UTF8)
$chlorMapStart = $chlor.IndexOf('const tableTextToKey')
$chlorMapEnd = $chlor.IndexOf('};', $chlorMapStart) + 2

$newMap = "  function mapCompoundToKey(cName) {`n    " + $chlor.Substring($chlorMapStart, $chlorMapEnd - $chlorMapStart) + "`n    const searchKey = cName.toLowerCase().replace(/[\s\-\`'\’\_]/g, '');`n    return tableTextToKey[searchKey] || cName;`n  }"
$func = $func.Substring(0, $mapStart) + $newMap + $func.Substring($mapEnd + 1)

$chlorStart = $chlor.IndexOf('function fillChlorHuuCoSection2')
$chlorEnd = $chlor.IndexOf('function cleanChlorHuuCoLastPageBreak')
$newChlor = $chlor.Substring(0, $chlorStart) + $func + $chlor.Substring($chlorEnd)

[System.IO.File]::WriteAllText('c:\Users\GCMS\Documents\GitHub\lims\gas\Report_ChlorHuuCo.gs', $newChlor, [System.Text.Encoding]::UTF8)
