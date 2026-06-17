/**
 * Canonical compound ID mapping and resolver helper for SOP Components
 * Verified against actual Firestore master_analytes database
 */

export const COMPOUND_TO_FIRESTORE_ID: Record<string, string> = {
  // BHC isomers
  'BHCa':            'bhc_alpha_benzene_hexachloride',
  'BHCb':            'bhc_beta',
  'BHCd':            'bhc_delta',
  'BHCe':            'bhc_epsilon',
  'BHCg':            'bhc_gamma_lindane_gamma_hch',
  'BHC-alpha':       'bhc_alpha_benzene_hexachloride',
  'BHC-alpha (benzene hexachloride)': 'bhc_alpha_benzene_hexachloride',
  'BHC-beta':        'bhc_beta',
  'BHC-delta':       'bhc_delta',
  'BHC-epsilon':     'bhc_epsilon',
  'BHC-gamma':       'bhc_gamma_lindane_gamma_hch',
  'BHC-gamma (Lindane, gamma HCH)': 'bhc_gamma_lindane_gamma_hch',
  
  // Chlordane
  'Chlordane_cis':   'chlordane_cis_alpha',
  'Chlordane_oxy':   'chlordane_oxy',
  'Chlordane_trans': 'chlordane_trans_gamma',
  'Chlordane-cis':   'chlordane_cis_alpha',
  'Chlordane-cis (alpha)': 'chlordane_cis_alpha',
  'Chlordane-oxy':   'chlordane_oxy',
  'Chlordane-trans': 'chlordane_trans_gamma',
  'Chlordane-trans (gamma)': 'chlordane_trans_gamma',
  
  // DDD / DDE / DDT
  'DDD_op':  'ddd_op',   'DDD-o,p': 'ddd_op',   "DDD-o,p'": 'ddd_op',  'ddd_o_p': 'ddd_op',
  'DDD_pp':  'ddd_pp',   'DDD-p,p': 'ddd_pp',   "DDD-p,p'": 'ddd_pp',  'ddd_p_p': 'ddd_pp',
  'DDE_op':  'dde_op',   'DDE-o,p': 'dde_op',   "DDE-o,p'": 'dde_op',  'dde_o_p': 'dde_op',
  'DDE_pp':  'dde_pp',   'DDE-p,p': 'dde_pp',   "DDE-p,p'": 'dde_pp',  'dde_p_p': 'dde_pp',
  'DDT_op':  'ddt_op',   'DDT-o,p': 'ddt_op',   "DDT-o,p'": 'ddt_op',  'ddt_o_p': 'ddt_op',
  'DDT_pp':  'ddt_pp',   'DDT-p,p': 'ddt_pp',   "DDT-p,p'": 'ddt_pp',  'ddt_p_p': 'ddt_pp',
  
  // Endosulfan
  'Endosulfan1':        'endosulfan_i_alpha_isomer',
  'Endosulfan2':        'endosulfan_ii_beta_isomer',
  'EndosulfanS':        'endosulfan_sulfate',
  'Endosulfan-I':       'endosulfan_i_alpha_isomer',
  'Endosulfan I (alpha isomer)': 'endosulfan_i_alpha_isomer',
  'Endosulfan-II':      'endosulfan_ii_beta_isomer',
  'Endosulfan II (beta isomer)': 'endosulfan_ii_beta_isomer',
  'Endosulfan-sulfate': 'endosulfan_sulfate',
  'Endosulfan sulfate': 'endosulfan_sulfate',
  
  // Heptachlor epoxide isomers
  'HeptachlorA':              'heptachlor_endo_epoxide_isomer_a',
  'HeptachlorB':              'heptachlor_exo_epoxide_isomer_b',
  'Heptachlor-epoxide-trans': 'heptachlor_endo_epoxide_isomer_a',
  'Heptachlor endo-epoxide (isomer A)': 'heptachlor_endo_epoxide_isomer_a',
  'Heptachlor-epoxide-cis':   'heptachlor_exo_epoxide_isomer_b',
  'Heptachlor exo-epoxide (isomer B)': 'heptachlor_exo_epoxide_isomer_b',
  
  // Others
  'HCB':          'hexachlorobenzene',
  'Hexachlorobenzene': 'hexachlorobenzene',
  'Methoxychlor': 'methoxychlor_pp_',
  "Methoxychlor, p,p'-": 'methoxychlor_pp_',
  'methoxychlor_p_p': 'methoxychlor_pp_',
  
  // Organophosphate (Lân hữu cơ)
  'Ethoprofos':         'ethoprophos_ethoprop',
  'Isofenphos-methyl':   'isofenphos_methyl',
  'Isofenphos methyl':    'isofenphos_methyl',
  'IsofenphosMethyl':     'isofenphos_methyl',
  'Isofenfos-methyl':    'isofenphos_methyl',
  'Azinphos-methyl':     'azinphos_methyl',
  'AzinphosMethyl':       'azinphos_methyl',
  'Azinfos-methyl':      'azinphos_methyl',
  'Chlorpyrifos-methyl': 'chlorpyrifos_methyl',
  'ChlorpyrifosMethyl':  'chlorpyrifos_methyl',
  'Chlorpyrofos-methyl': 'chlorpyrifos_methyl',
  'Chlorpyryfos-methyl': 'chlorpyrifos_methyl',
  'ChlorpyryfosMethyl':  'chlorpyrifos_methyl',
  'Pirimiphos-methyl':   'pirimiphos_methyl',
  'PirimiphosMethyl':     'pirimiphos_methyl',
  'Pirimifos-methyl':    'pirimiphos_methyl',
  'Parathion-methyl':    'parathion_methyl',
  'ParathionMethyl':     'parathion_methyl',
  'Parathion':           'parathion',
  'Parathion-ethyl':     'parathion',
  'Edifenphos':          'edifenphos',
  'Edifenfos':           'edifenphos',
  'Ronnel':              'ronnel_fenchlorphos',
  'Ronnel (Fenchlorphos)':'ronnel_fenchlorphos',
  
  // Fipronil group
  'Fipronil':                       'fipronil',
  'Fipronil desulfinyl':            'fipronil_desulfinyl',
  'Fipronil-desulfinyl':            'fipronil_desulfinyl',
  'Fipronil sulfide':               'fipronil_sulfide',
  'Fipronil-sulfide':               'fipronil_sulfide',
  'Fipronil sulfone':               'fipronil_sulfone',
  'Fipronil-sulfone':               'fipronil_sulfone',
  'Chlorpyrifos':                   'chlorpyrifos',
  'Chlorpyrofos':                   'chlorpyrifos',
  'Chlorpyryfos':                   'chlorpyrifos',
  'Chlorpyrifos methyl':            'chlorpyrifos_methyl',
  'Chlorpyrifos-methyl-desmethyl':  'chlorpyrifos_methyl_desmethyl',
  
  // Pyrethroid (Nhóm Cúc)
  'Cyfluthrin (Baythroid)': 'cyfluthrin_baythroid',
  'CyfluthrinBaythroid':   'cyfluthrin_baythroid',
  'lamda-Cyhalothrin':     'lamda_cyhalothrin',
  'lamdaCyhalothrin':       'lamda_cyhalothrin',
  'lambda-Cyhalothrin':    'lamda_cyhalothrin',
  'lambdaCyhalothrin':      'lamda_cyhalothrin',
  'Permethrin cis':        'permethrin_cis',
  'PermethrinCis':         'permethrin_cis',
  'Permethrin trans':      'permethrin_trans',
  'PermethrinTrans':       'permethrin_trans',
  'Cypermethrins':         'cypermethrins',
  'Cypermethrin':          'cypermethrins',

  // Trifluralin / Dichlorvos
  'Trifluralin':   'trifluralin',
  'Dichlorvos':    'trichlorfondipterexdichlorvos',
  'Trichlorfon':   'trichlorfondipterexdichlorvos',

  // Others
  'Ethoprophos': 'ethoprophos_ethoprop',
  'Ethoprophos (Ethoprop)': 'ethoprophos_ethoprop',

  // Chlor hữu cơ — simple-name compounds (canonical id = lowercase)
  // Cần thiết cho migrateResultDataKeys() reverse-lookup từ draft v1 (capital key)
  'Aldrin':        'aldrin',
  'Dieldrin':      'dieldrin',
  'Endrin':        'endrin',
  'Heptachlor':    'heptachlor',
  'Isodrin':       'isodrin',
  'Mirex':         'mirex',
  'Pendimethalin': 'pendimethalin',

  // ── Mappings aligned with GAS COMPOUND_TO_CANONICAL ───────────────────────
  'Acephate'                         : 'acephate',
  'Cadusafos'                        : 'cadusafos',
  'Diazinon'                         : 'diazinon',
  'Dimethoate'                       : 'dimethoate',
  'Ethion'                           : 'ethion',
  'Ethoprophos_ethoprop'             : 'ethoprophos_ethoprop',
  'Fenitrothion'                     : 'fenitrothion',
  'Fenthion'                         : 'fenthion',
  'FipronilSulfide'                  : 'fipronil_sulfide',
  'FipronilSulfone'                  : 'fipronil_sulfone',
  'FipronilDesulfinyl'               : 'fipronil_desulfinyl',
  'Iprobenfos'                       : 'iprobenfos',
  'Malathion'                        : 'malathion',
  'Mefenoxam'                        : 'mefenoxam',
  'Metalaxyl'                        : 'metalaxyl',
  'Methacrifos'                      : 'methacrifos',
  'Methidathion'                     : 'methidathion',
  'Monocrotophos'                    : 'monocrotophos',
  'Omethoate'                        : 'omethoate',
  'Phenthoate'                       : 'phenthoate',
  'Phorate'                          : 'phorate',
  'Phosmet'                          : 'phosmet',
  'Phosphamidon'                     : 'phosphamidon',
  'Pirimiphos methyl'                : 'pirimiphos_methyl',
  'Profenofos'                       : 'profenofos',
  'Quinalphos'                       : 'quinalphos',
  'Triazophos'                       : 'triazophos',
  'Vamidothion'                      : 'vamidothion',
  'Chlorfenvinphos'                  : 'chlorfenvinphos',
  'Bifenthrin'                       : 'bifenthrin',
  'Deltamethrin'                     : 'deltamethrin',
  'Tralomethrin'                     : 'tralomethrin',
  'Ethofenprox'                      : 'ethofenprox',
  'Fenpropathrin'                    : 'fenpropathrin',
  'Silafluofen'                      : 'silafluofen',
  'Flucythrinate'                    : 'flucythrinate',
  'Fenvalerate'                      : 'fenvalerate',
  'Tefluthrin'                       : 'tefluthrin',
  'Difenoconazole'                   : 'difenoconazole',
  'Propiconazole'                    : 'propiconazole',
  'Tetraconazole'                    : 'tetraconazole',
  'Hexaconazole'                     : 'hexaconazole',
  'Triadimenol'                      : 'triadimenol',
  'Paclobutrazol'                    : 'paclobutrazol',
  'Flutriafol'                       : 'flutriafol',
  'Imazalil'                         : 'imazalil',
  'Uniconazole'                      : 'uniconazole',
  'Tricyclazole'                     : 'tricyclazole',
  'Flusilazole'                      : 'flusilazole',
  'Cyproconazole'                    : 'cyproconazole',
  'Azoxystrobin'                     : 'azoxystrobin',
  'Fenbuconazole'                    : 'fenbuconazole',
  'Tebuconazole'                     : 'tebuconazole',
  'Bitertanol'                       : 'bitertanol',
  'Boscalid'                         : 'boscalid',
  'Buprofezin'                       : 'buprofezin',
  'Butachlor'                        : 'butachlor',
  'Cyprodinil'                       : 'cyprodinil',
  'Dicloran'                         : 'dicloran',
  'Fenoxanil'                        : 'fenoxanil',
  'Fluazifop'                        : 'fluazifop',
  'Fludioxonil'                      : 'fludioxonil',
  'Flufenacet'                       : 'flufenacet',
  'Kresoxim methyl'                  : 'kresoxim_methyl',
  'KresoximMethyl'                   : 'kresoxim_methyl',
  'Mecarbam'                         : 'mecarbam',
  'Mefenacet'                        : 'mefenacet',
  'Molinate'                         : 'molinate',
  'Nitrothal-Isopropyl'              : 'nitrothal_isopropyl',
  'NitrothalIsopropyl'               : 'nitrothal_isopropyl',
  'Alachlor'                         : 'alachlor',
  'Piperonyl butoxide'               : 'piperonyl_butoxide',
  'PiperonylButoxide'                : 'piperonyl_butoxide',
  'Propanil'                         : 'propanil',
  'Propoxur'                         : 'propoxur',
  'Simazine'                         : 'simazine',
  'Tebufenpyrad'                     : 'tebufenpyrad',
  'Atrazine'                         : 'atrazine',
  'Tebuthiuron'                      : 'tebuthiuron',
  'Thiabendazole'                    : 'thiabendazole',
  'Chlorfenapyr'                     : 'chlorfenapyr',
  'Vinclozolin'                      : 'vinclozolin',
  'Chlorothalonil'                   : 'chlorothalonil',
};

/**
 * SOP-01 (Fipronil/Chlorpyrifos) — Column key → canonical master_analyte.id
 *
 * SOP-01 dùng formType: 'type2' với column keys cố định (kqFip, kqClp, v.v.)
 * thay vì compounds[] như type-3b. Những column keys này được lưu trong Firestore
 * nên KHÔNG thể đổi tên. Thay vào đó, ta map chúng sang canonical id để
 * isTargetAssigned() có thể so sánh trực tiếp với sampleTargetMap.
 *
 * QUAN TRỌNG: Đây là single source of truth cho SOP-01 column mapping.
 * Mọi nơi cần display name hoặc canonical id của compound SOP-01 đều lấy từ đây.
 */
export const SOP01_COLUMN_TO_CANONICAL: Record<string, string> = {
  'kqFip':    'fipronil',
  'kqFipDesl':'fipronil_desulfinyl',
  'kqFipSulf':'fipronil_sulfide',
  'kqFipSulf2':'fipronil_sulfone',
  'kqClp':    'chlorpyrifos',
  'kqClpMe':  'chlorpyrifos_methyl',
  'kqClpMeDes':'chlorpyrifos_methyl_desmethyl'
};

/**
 * Lấy display name cho một column key của SOP-01.
 * Ưu tiên lookup từ masterTargets (canonical id → name).
 * Fallback về tên cố định nếu chưa có masterTargets.
 */
export function getSop01DisplayName(colKey: string, masterTargets: any[]): string {
  const canonicalId = SOP01_COLUMN_TO_CANONICAL[colKey];
  if (!canonicalId) return colKey;

  if (masterTargets && masterTargets.length > 0) {
    const canonicalSearch = getCanonicalId(canonicalId);
    const found = masterTargets.find(t => 
      getCanonicalId(t.id) === canonicalSearch || 
      getCanonicalId(t.name) === canonicalSearch
    );
    if (found?.name) return found.name;
  }

  // Fallback display names khi chưa load masterTargets
  const FALLBACK_NAMES: Record<string, string> = {
    'fipronil': 'Fipronil',
    'fipronil_desulfinyl': 'Fipronil desulfinyl',
    'fipronil_sulfide': 'Fipronil sulfide',
    'fipronil_sulfone': 'Fipronil sulfone',
    'chlorpyrifos': 'Chlorpyrifos',
    'chlorpyrifos_methyl': 'Chlorpyrifos-methyl',
    'chlorpyrifos_methyl_desmethyl': 'Chlorpyrifos-methyl-desmethyl'
  };
  return FALLBACK_NAMES[canonicalId] || canonicalId;
}

export function resolveCompoundDisplayName(compound: string, analytes: any[], sopIdOrConfigKey?: string | null): string {
  if (!analytes || analytes.length === 0) return compound;

  // Special overrides for spelling preferred by the user
  const lowerComp = compound.toLowerCase();
  if (lowerComp === 'chlorpyryfos' || lowerComp === 'chlorpyrifos' || lowerComp === 'chlorpyrofos') {
    return 'Chlorpyrifos';
  }
  if (lowerComp === 'chlorpyryfos-methyl' || lowerComp === 'chlorpyrifos-methyl' || lowerComp === 'chlorpyrofos-methyl' || lowerComp === 'chlorpyrifosmethyl' || lowerComp === 'chlorpyryfosmethyl') {
    return 'Chlorpyrifos-methyl';
  }

  let displayName = compound;

  // 1. Exact match by ID or Name (case-insensitive)
  const exactMatch = analytes.find(a =>
    a.id.toLowerCase() === compound.toLowerCase() ||
    a.name.toLowerCase() === compound.toLowerCase()
  );
  if (exactMatch) {
    displayName = exactMatch.name;
  } else {
    // 2. Match by Canonical ID
    const canonicalCompound = getCanonicalId(compound);
    const canonicalMatch = analytes.find(a => 
        getCanonicalId(a.id) === canonicalCompound || 
        getCanonicalId(a.name) === canonicalCompound
    );
    if (canonicalMatch) {
        displayName = canonicalMatch.name;
    } else {
        // 3. Direct Firestore ID lookup (legacy)
        const firestoreId = COMPOUND_TO_FIRESTORE_ID[compound];
        if (firestoreId) {
          const found = analytes.find(a => a.id === firestoreId);
          if (found) displayName = found.name;
        }
    }
  }

  // Strip Fipronil group suffixes if not SOP 9.16
  if (sopIdOrConfigKey !== '9.16-tbvtv-water' && sopIdOrConfigKey !== 'tbvtv-trong-nuoc-gcmsms') {
    if (displayName === 'Fipronil (nhóm I)' || displayName === 'Fipronil (nhóm Lân)') {
      return 'Fipronil';
    }
  }

  return displayName;
}

let firestoreIdsCache: Set<string> | null = null;

export function getCanonicalId(name: string): string {
  if (!name) return '';
  const lowerName = name.toLowerCase();

  if (!firestoreIdsCache) {
    firestoreIdsCache = new Set(Object.values(COMPOUND_TO_FIRESTORE_ID).map(v => v.toLowerCase()));
  }

  // 0. If it's already a known canonical firestore ID
  if (firestoreIdsCache.has(lowerName)) {
    return lowerName;
  }

  // 1. Direct exact mapping match
  const exact = COMPOUND_TO_FIRESTORE_ID[name];
  if (exact) return exact.toLowerCase();

  // 2. Case-insensitive mapping match
  for (const key of Object.keys(COMPOUND_TO_FIRESTORE_ID)) {
    if (key.toLowerCase() === lowerName) {
      return COMPOUND_TO_FIRESTORE_ID[key].toLowerCase();
    }
  }

  // 3. Fallback to slugified phonetic ID
  return lowerName.replace(/[\s\-]/g, '_');
}

/**
 * Determines if a compound is assigned to a sample based on the sample's target ID array
 */
export function isCompoundAssigned(assignedTargetIds: string[], compound: string, masterTargets?: any[]): boolean {
  if (!assignedTargetIds || assignedTargetIds.length === 0) return true;
  if (!compound) return false;

  const canonicalCompound = getCanonicalId(compound);

  return assignedTargetIds.some(tId => {
    // Direct match just in case
    if (tId.toLowerCase() === compound.toLowerCase()) return true;
    
    let targetName = tId;
    if (masterTargets && masterTargets.length > 0) {
      const found = resolveTargetMasterInfo(tId, masterTargets);
      if (found && found.name) {
        targetName = found.name;
        if (targetName.toLowerCase() === compound.toLowerCase()) return true;
      }
    }

    // Match by canonicalizing both sides
    return getCanonicalId(tId) === canonicalCompound || getCanonicalId(targetName) === canonicalCompound;
  });
}

/**
 * Dynamically resolves a compound name from config against the live TargetMaster list.
 * It uses exact matching, canonical matching, and prefix/substring matching to find the single source of truth.
 * Returns the exact master target object (with id and name) if found, otherwise null.
 */
export function resolveTargetMasterInfo(compound: string, masterTargets: any[]): any | null {
  if (!compound || !masterTargets || masterTargets.length === 0) return null;

  const targetIdStr = getCanonicalId(compound);
  
  // 1. Match by exact ID or Canonical ID
  let match = masterTargets.find(t => 
    t.id === targetIdStr || 
    getCanonicalId(t.id) === targetIdStr ||
    getCanonicalId(t.name) === targetIdStr
  );
  if (match) return match;

  // 2. Match by exact Name (case-insensitive)
  match = masterTargets.find(t => t.name.toLowerCase() === compound.toLowerCase());
  if (match) return match;

  // 3. Fallback to Firestore ID config
  const firestoreId = COMPOUND_TO_FIRESTORE_ID[compound];
  if (firestoreId) {
    match = masterTargets.find(t => t.id === firestoreId || getCanonicalId(t.id) === firestoreId);
    if (match) return match;
  }

  return null;
}
