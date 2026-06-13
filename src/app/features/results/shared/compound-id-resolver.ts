/**
 * Canonical compound ID mapping and resolver helper for SOP Components
 * Verified against actual Firestore master_analytes database
 */

export const COMPOUND_TO_FIRESTORE_ID: Record<string, string> = {
  // BHC isomers
  'BHCa':            'bhc-alpha_benzene_hexachloride',
  'BHCb':            'bhc-beta',
  'BHCd':            'bhc-delta',
  'BHCe':            'bhc-epsilon',
  'BHCg':            'bhc-gamma_lindane_gamma_hch',
  'BHC-alpha':       'bhc-alpha_benzene_hexachloride',
  'BHC-alpha (benzene hexachloride)': 'bhc-alpha_benzene_hexachloride',
  'BHC-beta':        'bhc-beta',
  'BHC-delta':       'bhc-delta',
  'BHC-epsilon':     'bhc-epsilon',
  'BHC-gamma':       'bhc-gamma_lindane_gamma_hch',
  'BHC-gamma (Lindane, gamma HCH)': 'bhc-gamma_lindane_gamma_hch',
  
  // Chlordane
  'Chlordane_cis':   'chlordane-cis_alpha',
  'Chlordane_oxy':   'chlordane-oxy',
  'Chlordane_trans': 'chlordane-trans_gamma',
  'Chlordane-cis':   'chlordane-cis_alpha',
  'Chlordane-cis (alpha)': 'chlordane-cis_alpha',
  'Chlordane-oxy':   'chlordane-oxy',
  'Chlordane-trans': 'chlordane-trans_gamma',
  'Chlordane-trans (gamma)': 'chlordane-trans_gamma',
  
  // DDD / DDE / DDT
  'DDD_op':  'ddd-op',   'DDD-o,p': 'ddd-op',   "DDD-o,p'": 'ddd-op',
  'DDD_pp':  'ddd-pp',   'DDD-p,p': 'ddd-pp',   "DDD-p,p'": 'ddd-pp',
  'DDE_op':  'dde-op',   'DDE-o,p': 'dde-op',   "DDE-o,p'": 'dde-op',
  'DDE_pp':  'dde-pp',   'DDE-p,p': 'dde-pp',   "DDE-p,p'": 'dde-pp',
  'DDT_op':  'ddt-op',   'DDT-o,p': 'ddt-op',   "DDT-o,p'": 'ddt-op',
  'DDT_pp':  'ddt-pp',   'DDT-p,p': 'ddt-pp',   "DDT-p,p'": 'ddt-pp',
  
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
  'HeptachlorA':              'heptachlor_endo-epoxide_isomer_a',
  'HeptachlorB':              'heptachlor_exo-epoxide_isomer_b',
  'Heptachlor-epoxide-trans': 'heptachlor_endo-epoxide_isomer_a',
  'Heptachlor endo-epoxide (isomer A)': 'heptachlor_endo-epoxide_isomer_a',
  'Heptachlor-epoxide-cis':   'heptachlor_exo-epoxide_isomer_b',
  'Heptachlor exo-epoxide (isomer B)': 'heptachlor_exo-epoxide_isomer_b',
  
  // Others
  'HCB':          'hexachlorobenzene',
  'Hexachlorobenzene': 'hexachlorobenzene',
  'Methoxychlor': 'methoxychlor_pp-',
  "Methoxychlor, p,p'-": 'methoxychlor_pp-',
  
  // Organophosphate (Lân hữu cơ)
  'Ethoprofos':         'ethoprophos_ethoprop',
  'Isofenphos-methyl':   'isofenfos_methyl',
  'IsofenphosMethyl':     'isofenfos_methyl',
  'Isofenfos-methyl':    'isofenfos_methyl',
  'Azinphos-methyl':     'azinfos_methyl',
  'AzinphosMethyl':       'azinfos_methyl',
  'Azinfos-methyl':      'azinfos_methyl',
  'Chlorpyrifos-methyl': 'chlorpyrifos-methyl',
  'ChlorpyrifosMethyl':  'chlorpyrifos-methyl',
  'Chlorpyrofos-methyl': 'chlorpyrifos-methyl',
  'Chlorpyryfos-methyl': 'chlorpyrifos-methyl',
  'ChlorpyryfosMethyl':  'chlorpyrifos-methyl',
  'Pirimiphos-methyl':   'pirimifos_methyl',
  'PirimiphosMethyl':     'pirimifos_methyl',
  'Pirimifos-methyl':    'pirimifos_methyl',
  'Parathion-methyl':    'parathion_methyl',
  'ParathionMethyl':     'parathion_methyl',
  'Parathion':           'parathion_ethyl',
  'Parathion-ethyl':     'parathion_ethyl',
  'Edifenphos':          'edifenfos',
  'Edifenfos':           'edifenfos',
  'Ronnel':              'ronnel_fenchlorphos',
  'Ronnel (Fenchlorphos)':'ronnel_fenchlorphos',
  
  // Fipronil group
  'Fipronil':                       'fipronil',
  'Fipronil desulfinyl':            'fipronil-desulfinyl',
  'Fipronil-desulfinyl':            'fipronil-desulfinyl',
  'Fipronil sulfide':               'fipronil-sulfide',
  'Fipronil-sulfide':               'fipronil-sulfide',
  'Fipronil sulfone':               'fipronil-sulfone',
  'Fipronil-sulfone':               'fipronil-sulfone',
  'Chlorpyrifos':                   'chlorpyrifos',
  'Chlorpyrofos':                   'chlorpyrifos',
  'Chlorpyryfos':                   'chlorpyrifos',
  'Chlorpyrifos methyl':            'chlorpyrifos-methyl',
  'Chlorpyrifos-methyl-desmethyl':  'chlorpyrifos-methyl-desmethyl',
  
  // Pyrethroid (Nhóm Cúc)
  'Cyfluthrin (Baythroid)': 'cyfluthrin_baythroid',
  'CyfluthrinBaythroid':   'cyfluthrin_baythroid',
  'lamda-Cyhalothrin':     'lambda_cyhalothrin',
  'lamdaCyhalothrin':       'lambda_cyhalothrin',
  'lambda-Cyhalothrin':    'lambda_cyhalothrin',
  'lambdaCyhalothrin':      'lambda_cyhalothrin',
  'Permethrin cis':        'permethrin_cis',
  'PermethrinCis':         'permethrin_cis',
  'Permethrin trans':      'permethrin_trans',
  'PermethrinTrans':       'permethrin_trans',
  'Cypermethrins':         'cypermethrin',
  'Cypermethrin':          'cypermethrin',

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
  'FipronilSulfide'                  : 'fipronil-sulfide',
  'FipronilSulfone'                  : 'fipronil-sulfone',
  'FipronilDesulfinyl'               : 'fipronil-desulfinyl',
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
  'Pirimiphos methyl'                : 'pirimifos_methyl',
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
  'Nitrothal-Isopropyl'              : 'nitrothal-isopropyl',
  'NitrothalIsopropyl'               : 'nitrothal-isopropyl',
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
  'kqFipDesl':'fipronil-desulfinyl',
  'kqFipSulf':'fipronil-sulfide',
  'kqFipSulf2':'fipronil-sulfone',
  'kqClp':    'chlorpyrifos',
  'kqClpMe':  'chlorpyrifos-methyl',
  'kqClpMeDes':'chlorpyrifos-methyl-desmethyl'
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
    const found = masterTargets.find(t => t.id === canonicalId);
    if (found?.name) return found.name;
  }

  // Fallback display names khi chưa load masterTargets
  const FALLBACK_NAMES: Record<string, string> = {
    'fipronil': 'Fipronil',
    'fipronil-desulfinyl': 'Fipronil desulfinyl',
    'fipronil-sulfide': 'Fipronil sulfide',
    'fipronil-sulfone': 'Fipronil sulfone',
    'chlorpyrifos': 'Chlorpyrifos',
    'chlorpyrifos-methyl': 'Chlorpyrifos-methyl',
    'chlorpyrifos-methyl-desmethyl': 'Chlorpyrifos-methyl-desmethyl'
  };
  return FALLBACK_NAMES[canonicalId] || canonicalId;
}

export function resolveCompoundDisplayName(compound: string, analytes: any[]): string {
  if (!analytes || analytes.length === 0) return compound;

  // Special overrides for spelling preferred by the user
  const lowerComp = compound.toLowerCase();
  if (lowerComp === 'chlorpyryfos' || lowerComp === 'chlorpyrifos' || lowerComp === 'chlorpyrofos') {
    return 'Chlorpyrifos';
  }
  if (lowerComp === 'chlorpyryfos-methyl' || lowerComp === 'chlorpyrifos-methyl' || lowerComp === 'chlorpyrofos-methyl' || lowerComp === 'chlorpyrifosmethyl' || lowerComp === 'chlorpyryfosmethyl') {
    return 'Chlorpyrifos-methyl';
  }

  // 1. Exact match by ID or Name (case-insensitive)
  const exactMatch = analytes.find(a =>
    a.id.toLowerCase() === compound.toLowerCase() ||
    a.name.toLowerCase() === compound.toLowerCase()
  );
  if (exactMatch) return exactMatch.name;

  // 2. Direct Firestore ID lookup (verified against actual master_analytes database)
  const firestoreId = COMPOUND_TO_FIRESTORE_ID[compound];
  if (firestoreId) {
    const found = analytes.find(a => a.id === firestoreId);
    if (found) return found.name;
  }

  // 3. Fallback
  return compound;
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
  return lowerName.replace(/[\s\-]/g, '_').replace(/ph/g, 'f');
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
      const found = masterTargets.find(t => t.id === tId);
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
export function resolveTargetMasterInfo(compound: string, masterTargets: any[]): { id: string, name: string } | null {
  if (!compound || !masterTargets || masterTargets.length === 0) return null;

  const targetIdStr = getCanonicalId(compound);
  
  // 1. Match by exact ID or Canonical ID
  let match = masterTargets.find(t => 
    t.id === targetIdStr || 
    getCanonicalId(t.id) === targetIdStr ||
    getCanonicalId(t.name) === targetIdStr
  );
  if (match) return { id: match.id, name: match.name };

  // 2. Match by exact Name (case-insensitive)
  match = masterTargets.find(t => t.name.toLowerCase() === compound.toLowerCase());
  if (match) return { id: match.id, name: match.name };

  // 3. Match by partial substring (e.g. config "Ethoprophos" matches master "Ethoprophos (Ethoprop)")
  match = masterTargets.find(t => 
    t.name.toLowerCase().startsWith(compound.toLowerCase()) || 
    compound.toLowerCase().startsWith(t.name.toLowerCase())
  );
  if (match) return { id: match.id, name: match.name };

  return null;
}
