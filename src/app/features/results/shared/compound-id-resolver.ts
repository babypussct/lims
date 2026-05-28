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
  'BHC-beta':        'bhc-beta',
  'BHC-delta':       'bhc-delta',
  'BHC-epsilon':     'bhc-epsilon',
  'BHC-gamma':       'bhc-gamma_lindane_gamma_hch',
  
  // Chlordane
  'Chlordane_cis':   'chlordane-cis_alpha',
  'Chlordane_oxy':   'chlordane-oxy',
  'Chlordane_trans': 'chlordane-trans_gamma',
  'Chlordane-cis':   'chlordane-cis_alpha',
  'Chlordane-oxy':   'chlordane-oxy',
  'Chlordane-trans': 'chlordane-trans_gamma',
  
  // DDD / DDE / DDT
  'DDD_op':  'ddd-op',   'DDD-o,p': 'ddd-op',
  'DDD_pp':  'ddd-pp',   'DDD-p,p': 'ddd-pp',
  'DDE_op':  'dde-op',   'DDE-o,p': 'dde-op',
  'DDE_pp':  'dde-pp',   'DDE-p,p': 'dde-pp',
  'DDT_op':  'ddt-op',   'DDT-o,p': 'ddt-op',
  'DDT_pp':  'ddt-pp',   'DDT-p,p': 'ddt-pp',
  
  // Endosulfan
  'Endosulfan1':        'endosulfan_i_alpha_isomer',
  'Endosulfan2':        'endosulfan_ii_beta_isomer',
  'EndosulfanS':        'endosulfan_sulfate',
  'Endosulfan-I':       'endosulfan_i_alpha_isomer',
  'Endosulfan-II':      'endosulfan_ii_beta_isomer',
  'Endosulfan-sulfate': 'endosulfan_sulfate',
  
  // Heptachlor epoxide isomers
  'HeptachlorA':              'heptachlor_endo-epoxide_isomer_a',
  'HeptachlorB':              'heptachlor_exo-epoxide_isomer_b',
  'Heptachlor-epoxide-trans': 'heptachlor_endo-epoxide_isomer_a',
  'Heptachlor-epoxide-cis':   'heptachlor_exo-epoxide_isomer_b',
  
  // Others
  'HCB':          'hexachlorobenzene',
  'Hexachlorobenzene': 'hexachlorobenzene',
  'Methoxychlor': 'methoxychlor_pp-',
  
  // Organophosphate (Lân hữu cơ)
  'Ethoprophos':       'ethoprophos_ethoprop',
  'Isofenphos-methyl': 'isofenphos_methyl',
  
  // Fipronil group
  'Fipronil':                       'fipronil',
  'Fipronil desulfinyl':            'fipronil-desulfinyl',
  'Fipronil sulfide':               'fipronil-sulfide',
  'Fipronil sulfone':               'fipronil-sulfone',
  'Chlorpyrifos':                   'chlorpyrifos',
  'Chlorpyrifos methyl':            'chlorpyrifos-methyl',
  'Chlorpyriphos-methyl-desmethyl': 'chlorpyrifos-methyl-desmethyl',
  
  // Trifluralin / Dichlorvos
  'Trifluralin':   'trifluralin',
  'Dichlorvos':    'trichlorfondipterexdichlorvos',
  'Trichlorfon':   'trichlorfondipterexdichlorvos',
};

/**
 * Resolves a friendly compound key (from configs/forms) to its display name from Firestore master_targets library
 */
export function resolveCompoundDisplayName(compound: string, analytes: any[]): string {
  if (!analytes || analytes.length === 0) return compound;

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

/**
 * Determines if a compound is assigned to a sample based on the sample's target ID array
 */
export function isCompoundAssigned(assignedTargetIds: string[], compound: string): boolean {
  if (!assignedTargetIds) return true;

  // 1. Direct match: check if exact compound key or its lowercased version is in the array
  const lowerCompound = compound.toLowerCase();
  if (assignedTargetIds.some(tId => tId.toLowerCase() === lowerCompound)) {
    return true;
  }

  // 2. Map-based match: check if the resolved canonical Firestore ID is assigned
  const firestoreId = COMPOUND_TO_FIRESTORE_ID[compound];
  if (firestoreId) {
    const lowerId = firestoreId.toLowerCase();
    return assignedTargetIds.some(tId => tId.toLowerCase() === lowerId);
  }

  return false;
}
