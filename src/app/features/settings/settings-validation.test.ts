import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  findUsersReferencingRole,
  validateCategoriesDraft,
  validateSafetyConfigDraft,
} from './settings-validation.utils';

describe('Settings validation hardening', () => {
  it('normalizes category values without silently dropping incomplete rows', () => {
    assert.deepEqual(validateCategoriesDraft([
      { id: ' reagent ', name: ' Hóa chất ' },
      { id: 'solvent', name: 'Dung môi' },
    ]), {
      ok: true,
      value: [
        { id: 'reagent', name: 'Hóa chất' },
        { id: 'solvent', name: 'Dung môi' },
      ],
    });

    const incomplete = validateCategoriesDraft([
      { id: 'reagent', name: 'Hóa chất' },
      { id: '', name: 'Dòng đang nhập dở' },
    ]);
    assert.equal(incomplete.ok, false);
    if (!incomplete.ok) assert.match(incomplete.message, /dòng 2/i);
  });

  it('rejects duplicate category ids case-insensitively', () => {
    const result = validateCategoriesDraft([
      { id: 'Standard', name: 'Chất chuẩn' },
      { id: 'standard', name: 'Chuẩn khác' },
    ]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.message, /trùng/i);
  });

  it('requires all safety margins to stay within 0-100 percent', () => {
    const valid = validateSafetyConfigDraft(10, [
      { category: 'standard', margin: 2.5 },
      { category: 'solvent', margin: 20 },
    ]);
    assert.deepEqual(valid, {
      ok: true,
      value: {
        defaultMargin: 10,
        rules: { standard: 2.5, solvent: 20 },
      },
    });

    for (const badValue of ['', null, undefined, -0.1, 100.1, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.equal(validateSafetyConfigDraft(badValue, []).ok, false);
    }

    assert.equal(validateSafetyConfigDraft(10, [{ category: 'standard', margin: 101 }]).ok, false);
  });

  it('rejects blank and duplicate safety rule categories', () => {
    assert.equal(validateSafetyConfigDraft(10, [{ category: '', margin: 10 }]).ok, false);
    assert.equal(validateSafetyConfigDraft(10, [
      { category: 'Solvent', margin: 10 },
      { category: 'solvent', margin: 15 },
    ]).ok, false);
  });

  it('finds every user still referencing a role before deletion', () => {
    const users = [
      { uid: 'u1', role: 'staff', roleId: 'role_qc' },
      { uid: 'u2', role: 'staff', roleId: 'role_other' },
      { uid: 'u3', role: 'staff', roleId: 'role_qc' },
      { uid: 'u4', role: 'manager', roleId: 'role_qc' },
    ];
    assert.deepEqual(findUsersReferencingRole(users, 'role_qc').map(user => user.uid), ['u1', 'u3']);
  });
});
