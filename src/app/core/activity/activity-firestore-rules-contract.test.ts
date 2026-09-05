import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  ACTIVITY_ACTION_REGISTRY,
  type ActivityActionDefinition
} from './activity-event-registry';

const rules = readFileSync('firestore.rules', 'utf8');
const definitions = Object.values(ACTIVITY_ACTION_REGISTRY) as ActivityActionDefinition[];

function extractActionGroup(functionName: string): string[] {
  const match = rules.match(new RegExp(
    `function ${functionName}\\(action\\) \\{([\\s\\S]*?)\\n    \\}`
  ));
  assert.ok(match, `Rules helper ${functionName} must exist`);
  return Array.from(match[1].matchAll(/'([A-Z][A-Z0-9_]*)'/g), result => result[1]).sort();
}

function registryActionsWhere(
  predicate: (definition: ActivityActionDefinition) => boolean
): string[] {
  return definitions.filter(predicate).map(definition => definition.action).sort();
}

test('Firestore Rules action/audience classification stays in lockstep with the registry', () => {
  const groups = [
    ['isResultViewActivityAction', 'RESULT_VIEW', 'RESULT', 'BUSINESS'],
    ['isResultOperatorActivityAction', 'RESULT_OPERATOR', 'RESULT', 'BUSINESS'],
    ['isInventoryViewActivityAction', 'INVENTORY_VIEW', 'INVENTORY', 'BUSINESS'],
    ['isInventoryOperatorActivityAction', 'INVENTORY_OPERATOR', 'INVENTORY', 'BUSINESS'],
    ['isStandardViewActivityAction', 'STANDARD_VIEW', 'STANDARD', 'BUSINESS'],
    ['isStandardOperatorActivityAction', 'STANDARD_OPERATOR', 'STANDARD', 'BUSINESS'],
    ['isDutyOperatorActivityAction', 'DUTY_OPERATOR', 'DUTY', 'BUSINESS'],
    ['isSystemAdminActivityAction', 'SYSTEM_ADMIN', 'SYSTEM', 'SYSTEM']
  ] as const;

  for (const [helper, audience, module, auditClass] of groups) {
    assert.deepEqual(
      extractActionGroup(helper),
      registryActionsWhere(definition => definition.audience === audience),
      `${helper} must contain exactly the registry actions for ${audience}`
    );

    const clause = new RegExp(
      `${helper}\\(action\\)[\\s\\S]{0,160}` +
      `module == '${module}'[\\s\\S]{0,120}` +
      `audience == '${audience}'[\\s\\S]{0,120}` +
      `auditClass == '${auditClass}'`
    );
    assert.match(rules, clause, `${helper} must enforce the registry module/audience/auditClass tuple`);
  }

  const classified = groups.flatMap(([helper]) => extractActionGroup(helper)).sort();
  assert.deepEqual(
    classified,
    definitions.map(definition => definition.action).sort(),
    'every registry action must be classified exactly once in Rules'
  );
});

test('Firestore Rules importance and activityVisible values stay in lockstep with the registry', () => {
  const importanceGroups = [
    ['isNormalActivityAction', 'NORMAL'],
    ['isImportantActivityAction', 'IMPORTANT'],
    ['isWarningActivityAction', 'WARNING']
  ] as const;

  for (const [helper, importance] of importanceGroups) {
    assert.deepEqual(
      extractActionGroup(helper),
      registryActionsWhere(definition => definition.importance === importance),
      `${helper} must match registry importance=${importance}`
    );
  }

  assert.deepEqual(
    extractActionGroup('isHiddenActivityAction'),
    registryActionsWhere(definition => definition.activityVisible === false),
    'Rules hidden-action group must match registry activityVisible=false'
  );
});

test('Firestore Rules public-traceability action allowlist stays in lockstep with the registry', () => {
  assert.deepEqual(
    extractActionGroup('canBePublicTraceableActivityAction'),
    registryActionsWhere(definition => definition.publicTraceableAllowed === true),
    'Rules public-traceability allowlist must match registry eligibility'
  );
});
