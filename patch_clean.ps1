$lan = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\gas\Report_LanHuuCo.gs', [System.Text.Encoding]::UTF8)
$chlor = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\gas\Report_ChlorHuuCo.gs', [System.Text.Encoding]::UTF8)

# 1. Get generator from lan
$genStart = $lan.IndexOf('function generateCustomReport_lan_huu_co')
$genEnd = $lan.IndexOf('function replaceCheckboxSafely(', $genStart)
$genText = $lan.Substring($genStart, $genEnd - $genStart)
$genText = $genText.Replace('generateCustomReport_lan_huu_co', 'generateCustomReport_chlor_huu_co')
$genText = $genText.Replace('lan-huu-co', 'chlor-huu-co')
$genText = $genText.Replace('LanHuuCo', 'ChlorHuuCo')
$genText = $genText.Replace("['Chlorpyrifos']", "['Aldrin']")

# 2. Get fill section 2 from lan
$secStart = $lan.IndexOf('function fillLanHuuCoSection2')
$secEnd = $lan.IndexOf('function cleanLanHuuCoLastPageBreak', $secStart)
$secText = $lan.Substring($secStart, $secEnd - $secStart)
$secText = $secText.Replace('fillLanHuuCoSection2', 'fillChlorHuuCoSection2')

# 3. Get tableTextToKey from chlor
$mapObjStart = $chlor.IndexOf('const tableTextToKey = {')
$mapObjEnd = $chlor.IndexOf('};', $mapObjStart) + 2
$mapObjText = $chlor.Substring($mapObjStart, $mapObjEnd - $mapObjStart)

# 4. Replace mapCompoundToKey in secText
$mapFuncStart = $secText.IndexOf('function mapCompoundToKey(cName)')
$mapFuncEnd = $secText.IndexOf('return cName;', $mapFuncStart) + 13
$newMapFunc = "function mapCompoundToKey(cName) {`n    " + $mapObjText + "`n    const searchKey = cName.toLowerCase().replace(/[\s\-\`'\’\_]/g, '');`n    return tableTextToKey[searchKey] || cName;"
$secText = $secText.Substring(0, $mapFuncStart) + $newMapFunc + $secText.Substring($mapFuncEnd + 1)

# 5. Replace generator in chlor
$cGenStart = $chlor.IndexOf('function generateCustomReport_chlor_huu_co')
$cGenEnd = $chlor.IndexOf('function generateChlorHuuCoReport(', $cGenStart)
$newChlor = $chlor.Substring(0, $cGenStart) + $genText + $chlor.Substring($cGenEnd)

# 6. Append secText to end of chlor
$newChlor = $newChlor.TrimEnd() + "`n`n" + $secText.TrimEnd() + "`n"

[System.IO.File]::WriteAllText('c:\Users\GCMS\Documents\GitHub\lims\gas\Report_ChlorHuuCo.gs', $newChlor, [System.Text.Encoding]::UTF8)
