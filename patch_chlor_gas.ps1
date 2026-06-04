$lanFile = 'c:\Users\GCMS\Documents\GitHub\lims\gas\Report_LanHuuCo.gs'
$chlorFile = 'c:\Users\GCMS\Documents\GitHub\lims\gas\Report_ChlorHuuCo.gs'

$lanContent = [System.IO.File]::ReadAllText($lanFile)
$chlorContent = [System.IO.File]::ReadAllText($chlorFile)

# 1. Extract generateCustomReport_lan_huu_co
$startFunc1 = $lanContent.IndexOf('function generateCustomReport_lan_huu_co')
$endFunc1 = $lanContent.IndexOf('function replaceCheckboxSafely(', $startFunc1)
$genFuncText = $lanContent.Substring($startFunc1, $endFunc1 - $startFunc1)

# Modify genFuncText to chlor-huu-co
$genFuncText = $genFuncText.Replace('generateCustomReport_lan_huu_co', 'generateCustomReport_chlor_huu_co')
$genFuncText = $genFuncText.Replace('lan-huu-co', 'chlor-huu-co')
$genFuncText = $genFuncText.Replace('fillLanHuuCoSection2', 'fillChlorHuuCoSection2')
$genFuncText = $genFuncText.Replace('cleanLanHuuCoLastPageBreak', 'cleanChlorHuuCoLastPageBreak')
$genFuncText = $genFuncText.Replace('fillLanHuuCoSampleForElements', 'fillChlorHuuCoSampleForElements')

# In genFuncText, the default compound is 'Chlorpyrifos', change to 'Aldrin'
$genFuncText = $genFuncText.Replace("compounds = ['Chlorpyrifos']", "compounds = ['Aldrin']")

# 2. Extract fillLanHuuCoSection2
$startFunc2 = $lanContent.IndexOf('function fillLanHuuCoSection2')
$endFunc2 = $lanContent.IndexOf('function cleanLanHuuCoLastPageBreak', $startFunc2)
$sec2Text = $lanContent.Substring($startFunc2, $endFunc2 - $startFunc2)

# Modify sec2Text
$sec2Text = $sec2Text.Replace('function fillLanHuuCoSection2', 'function fillChlorHuuCoSection2')

# In sec2Text, there is mapCompoundToKey. We need to replace the directMap inside it.
# Instead of doing complex parsing, we can just replace the whole mapCompoundToKey block.
$mapStart = $sec2Text.IndexOf('function mapCompoundToKey(cName)')
$mapEnd = $sec2Text.IndexOf('    return directMap[cName] || cName;') + 37
$newMap = @"
  function mapCompoundToKey(cName) {
    const tableTextToKey = {
      'aldrin': 'Aldrin',
      'bhca': 'BHCa', 'bhc-alpha': 'BHCa', 'alpha-bhc': 'BHCa', 'α-bhc': 'BHCa',
      'bhcb': 'BHCb', 'bhc-beta': 'BHCb', 'beta-bhc': 'BHCb', 'β-bhc': 'BHCb',
      'bhcd': 'BHCd', 'bhc-delta': 'BHCd', 'delta-bhc': 'BHCd', 'δ-bhc': 'BHCd',
      'bhce': 'BHCe', 'bhc-epsilon': 'BHCe', 'epsilon-bhc': 'BHCe', 'ε-bhc': 'BHCe',
      'bhcg': 'BHCg', 'bhc-gamma': 'BHCg', 'gamma-bhc': 'BHCg', 'γ-bhc': 'BHCg', 'lindane': 'BHCg',
      'chlordane_cis': 'Chlordane_cis', 'chlordane-cis': 'Chlordane_cis', 'cis-chlordane': 'Chlordane_cis',
      'chlordane_oxy': 'Chlordane_oxy', 'chlordane-oxy': 'Chlordane_oxy', 'oxy-chlordane': 'Chlordane_oxy',
      'chlordane_trans': 'Chlordane_trans', 'chlordane-trans': 'Chlordane_trans', 'trans-chlordane': 'Chlordane_trans',
      'ddd_op': 'DDD_op', 'ddd-o,p': 'DDD_op', 'o,p-ddd': 'DDD_op', 'o,p''-ddd': 'DDD_op',
      'ddd_pp': 'DDD_pp', 'ddd-p,p': 'DDD_pp', 'p,p-ddd': 'DDD_pp', 'p,p''-ddd': 'DDD_pp',
      'dde_op': 'DDE_op', 'dde-o,p': 'DDE_op', 'o,p-dde': 'DDE_op', 'o,p''-dde': 'DDE_op',
      'dde_pp': 'DDE_pp', 'dde-p,p': 'DDE_pp', 'p,p-dde': 'DDE_pp', 'p,p''-dde': 'DDE_pp',
      'ddt_op': 'DDT_op', 'ddt-o,p': 'DDT_op', 'o,p-ddt': 'DDT_op', 'o,p''-ddt': 'DDT_op',
      'ddt_pp': 'DDT_pp', 'ddt-p,p': 'DDT_pp', 'p,p-ddt': 'DDT_pp', 'p,p''-ddt': 'DDT_pp',
      'dieldrin': 'Dieldrin',
      'endosulfan1': 'Endosulfan1', 'endosulfan-i': 'Endosulfan1', 'alpha-endosulfan': 'Endosulfan1',
      'endosulfan2': 'Endosulfan2', 'endosulfan-ii': 'Endosulfan2', 'beta-endosulfan': 'Endosulfan2',
      'endosulfans': 'EndosulfanS', 'endosulfan-sulfate': 'EndosulfanS',
      'endrin': 'Endrin',
      'heptachlorendoepoxideisomera': 'HeptachlorA', 'heptachlor epoxide isomer a': 'HeptachlorA', 'heptachlorepoxideisomera': 'HeptachlorA',
      'heptachlorexoepoxideisomerb': 'HeptachlorB', 'heptachlor epoxide isomer b': 'HeptachlorB', 'heptachlorepoxideisomerb': 'HeptachlorB',
      'heptachlora': 'HeptachlorA', 'heptachlor-epoxide-trans': 'HeptachlorA', 'heptachlor epoxide trans': 'HeptachlorA',
      'heptachlorb': 'HeptachlorB', 'heptachlor-epoxide-cis': 'HeptachlorB', 'heptachlor epoxide cis': 'HeptachlorB',
      'heptachlor': 'Heptachlor',
      'hcb': 'HCB', 'hexachlorobenzene': 'HCB',
      'isodrin': 'Isodrin',
      'methoxychlor': 'Methoxychlor',
      'mirex': 'Mirex',
      'pendimethalin': 'Pendimethalin'
    };
    const searchKey = cName.toLowerCase().replace(/[\s\-\'\’\_]/g, '');
    return tableTextToKey[searchKey] || cName;
  }
"@

$sec2Text = $sec2Text.Substring(0, $mapStart) + $newMap + $sec2Text.Substring($mapEnd)

# Replace generateCustomReport_chlor_huu_co in chlor file
$cStartFunc = $chlorContent.IndexOf('function generateCustomReport_chlor_huu_co')
$cEndFunc = $chlorContent.IndexOf('function generateChlorHuuCoReport(', $cStartFunc)

$newChlorContent = $chlorContent.Substring(0, $cStartFunc) + $genFuncText + $chlorContent.Substring($cEndFunc)

# Append sec2Text to the end
$newChlorContent = $newChlorContent + "`n" + $sec2Text

[System.IO.File]::WriteAllText($chlorFile, $newChlorContent)
