import { COMPOUND_TO_FIRESTORE_ID, getCanonicalId, isCompoundAssigned } from '../../src/app/features/results/shared/compound-id-resolver';

const masterTargets = [
  { id: 'methoxychlor_pp_', name: "Methoxychlor, p,p'-" },
  { id: 'ddd_op', name: "DDD-o,p'" },
  { id: 'ddd_pp', name: "DDD-p,p'" },
  { id: 'dde_op', name: "DDE-o,p'" },
  { id: 'dde_pp', name: "DDE-p,p'" },
  { id: 'ddt_op', name: "DDT-o,p'" },
  { id: 'ddt_pp', name: "DDT-p,p'" },
];

const assignedIds = ['ddd_op', "DDD-o,p'", "DDD-o,p' "];

console.log('Test ddd_op');
console.log('assigned = ddd_op:', isCompoundAssigned(['ddd_op'], 'ddd_op', masterTargets));
console.log('assigned = "DDD-o,p\'":', isCompoundAssigned(["DDD-o,p'"], 'ddd_op', masterTargets));
console.log('assigned = "DDD-o,p\' ":', isCompoundAssigned(["DDD-o,p' "], 'ddd_op', masterTargets));
console.log('assigned = ddd_o_p:', isCompoundAssigned(['ddd_o_p'], 'ddd_op', masterTargets));
console.log('assigned = DDD-o,p:', isCompoundAssigned(['DDD-o,p'], 'ddd_op', masterTargets));

