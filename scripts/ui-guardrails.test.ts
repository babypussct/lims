import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
// @ts-ignore
import guardrails from './ui-guardrails.js';

const {
  parseOpeningTags,
  parseClassTokens,
  parseClassReferences,
  normalizeToken,
  auditPageHeaderPurity
} = guardrails;

describe('ui-guardrails opening tag parser and token normalizer', () => {
  it('parses opening tags without premature truncation on angular input expressions', () => {
    const template = `
      <div>
        <app-page-header
          [title]="count > 0 ? 'Có ' + count + ' mục' : 'Chưa có mục'"
          class="block mb-4"
          icon="fa-flask">
        </app-page-header>
      </div>
    `;

    const tags = parseOpeningTags(template, 'app-page-header');
    assert.equal(tags.length, 1);
    assert.match(tags[0].tag, /\[title\]="count > 0 \? 'Có ' \+ count \+ ' mục' : 'Chưa có mục'"/);
    assert.match(tags[0].tag, /class="block mb-4"/);
  });

  it('normalizes Tailwind tokens across responsive, dark, important and state prefixes', () => {
    assert.equal(normalizeToken('dark:border-slate-700'), 'border-slate-700');
    assert.equal(normalizeToken('md:hover:bg-fuchsia-600'), 'bg-fuchsia-600');
    assert.equal(normalizeToken('!bg-white'), 'bg-white');
    assert.equal(normalizeToken('hover:!shadow-md'), 'shadow-md');
    assert.equal(normalizeToken('shadow-sm'), 'shadow-sm');
    assert.equal(normalizeToken('sm:rounded-2xl'), 'rounded-2xl');
    assert.equal(normalizeToken('bg-[#fff]'), 'bg-[#fff]');
    assert.equal(normalizeToken('shadow-[0_2px_8px_black]'), 'shadow-[0_2px_8px_black]');
    assert.equal(normalizeToken('hover:bg-[color:var(--surface)]'), 'bg-[color:var(--surface)]');
    assert.equal(normalizeToken('bg-[url(data:image/svg+xml;base64,abc)]'), 'bg-[url(data:image/svg+xml;base64,abc)]');
  });

  it('allows zero/none utility resets including ring-0 and layout utility classes', () => {
    const tokens = parseClassTokens('<app-page-header class="block shrink-0 mb-4 border-0 shadow-none ring-0 bg-transparent rounded-none">');
    assert.deepEqual(tokens, ['block', 'shrink-0', 'mb-4', 'border-0', 'shadow-none', 'ring-0', 'bg-transparent', 'rounded-none']);
  });

  it('parses structured class references for static, dynamic, boolean and ngClass bindings', () => {
    const refs = parseClassReferences(
      `<app-page-header
        class="block mb-4"
        [class]="'mt-2 w-full'"
        [class.border]="true"
        [class.border-slate-200]="isEnabled"
        [ngClass]="{ 'shadow-sm': isElevated, 'bg-white': true }">`
    );

    const tokenValues = refs.filter((r: any) => r.kind === 'token').map((r: any) => r.value);
    assert.ok(tokenValues.includes('block'));
    assert.ok(tokenValues.includes('mb-4'));
    assert.ok(tokenValues.includes('mt-2'));
    assert.ok(tokenValues.includes('w-full'));
    assert.ok(tokenValues.includes('border'));
    assert.ok(tokenValues.includes('border-slate-200'));
    assert.ok(tokenValues.includes('shadow-sm'));
    assert.ok(tokenValues.includes('bg-white'));
  });

  it('marks opaque expressions as kind: opaque', () => {
    const interpolationRefs = parseClassReferences('<app-page-header class="block {{ computedHeaderClasses }}">');
    assert.equal(interpolationRefs.length, 1);
    assert.equal(interpolationRefs[0].kind, 'opaque');
    assert.equal(interpolationRefs[0].attribute, 'class');

    const dynamicClassRefs = parseClassReferences('<app-page-header [class]="headerClasses">');
    assert.equal(dynamicClassRefs.length, 1);
    assert.equal(dynamicClassRefs[0].kind, 'opaque');
    assert.equal(dynamicClassRefs[0].attribute, '[class]');

    const dynamicNgClassRefs = parseClassReferences("<app-page-header [ngClass]=\"isCard ? 'border' : dynamicClass\">");
    assert.equal(dynamicNgClassRefs.length, 1);
    assert.equal(dynamicNgClassRefs[0].kind, 'opaque');
    assert.equal(dynamicNgClassRefs[0].attribute, '[ngClass]');

    const attrClassRefs = parseClassReferences('<app-page-header [attr.class]="computedClasses">');
    assert.equal(attrClassRefs.length, 1);
    assert.equal(attrClassRefs[0].kind, 'opaque');
    assert.equal(attrClassRefs[0].attribute, '[attr.class]');

    const classNameRefs = parseClassReferences('<app-page-header [className]="computedClasses">');
    assert.equal(classNameRefs.length, 1);
    assert.equal(classNameRefs[0].kind, 'opaque');
    assert.equal(classNameRefs[0].attribute, '[className]');
  });
});

describe('ui-guardrails auditPageHeaderPurity with fixture files', () => {
  function withTempDir(fn: (dir: string) => void) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lims-guardrail-test-'));
    try {
      fn(tmpDir);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  it('allows clean page headers with resets', () => {
    withTempDir((dir) => {
      const file = path.join(dir, 'test.component.html');
      fs.writeFileSync(file, `
        <app-page-header
          title="Thử nghiệm"
          class="block mb-4 border-0 shadow-none ring-0 bg-transparent rounded-none"
          icon="fa-flask">
        </app-page-header>
      `);

      const violations = auditPageHeaderPurity([file]);
      assert.equal(violations.length, 0);
    });
  });

  it('catches prohibited static, boolean and ngClass bindings', () => {
    withTempDir((dir) => {
      const file = path.join(dir, 'test.component.html');
      fs.writeFileSync(file, `
        <app-page-header class="border shadow-md bg-white"></app-page-header>
        <app-page-header [class.border-slate-200]="true"></app-page-header>
        <app-page-header [ngClass]="{ 'shadow-sm': true }"></app-page-header>
        <app-page-header [class]="'!bg-white'"></app-page-header>
        <app-page-header class="bg-[#fff] shadow-[0_2px_8px_black]"></app-page-header>
        <app-page-header class="hover:bg-[color:var(--surface)] bg-[url(data:image/svg+xml;base64,abc)]"></app-page-header>
      `);

      const violations = auditPageHeaderPurity([file]);
      assert.equal(violations.length, 10);
    });
  });

  it('catches opaque expressions as violations on page variant', () => {
    withTempDir((dir) => {
      const file = path.join(dir, 'test.component.html');
      fs.writeFileSync(file, `
        <app-page-header class="block {{ computedClasses }}"></app-page-header>
        <app-page-header [class]="headerClasses"></app-page-header>
        <app-page-header [ngClass]="isCard ? 'border' : dynamicClass"></app-page-header>
        <app-page-header [attr.class]="computedClasses"></app-page-header>
        <app-page-header [className]="computedClasses"></app-page-header>
      `);

      const violations = auditPageHeaderPurity([file]);
      assert.equal(violations.length, 5);
      assert.equal(violations[0].reason, 'opaque-class-binding');
      assert.equal(violations[1].reason, 'opaque-class-binding');
      assert.equal(violations[2].reason, 'opaque-class-binding');
      assert.equal(violations[3].reason, 'opaque-class-binding');
      assert.equal(violations[4].reason, 'opaque-class-binding');
    });
  });

  it('skips explicit workspace, detail and section variants but audits dynamic [variant]', () => {
    withTempDir((dir) => {
      const file = path.join(dir, 'test.component.html');
      fs.writeFileSync(file, `
        <app-page-header variant="workspace" class="border shadow-md bg-white"></app-page-header>
        <app-page-header variant="detail" class="border shadow-md bg-white"></app-page-header>
        <app-page-header variant="section" class="border shadow-md bg-white"></app-page-header>
        <app-page-header [variant]="isWorkspace ? 'workspace' : 'page'" class="border shadow-md bg-white"></app-page-header>
      `);

      const violations = auditPageHeaderPurity([file]);
      assert.equal(violations.length, 3);
      assert.ok(violations.every((v: any) => v.tag.includes('[variant]')));
    });
  });
});

describe('ui-guardrails CLI child process failure seam', () => {
  it('exits with code 0 on clean external fixture directory', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lims-cli-clean-'));
    try {
      const cleanFile = path.join(tmpDir, 'clean.component.html');
      fs.writeFileSync(cleanFile, `
        <app-page-header title="Sạch" class="block mb-4 border-0 shadow-none ring-0"></app-page-header>
      `);

      const scriptPath = path.resolve('scripts/ui-guardrails.js');
      const res = spawnSync(process.execPath, [scriptPath, '--source-root', tmpDir], { encoding: 'utf8' });
      assert.equal(res.status, 0, `Expected 0 but got ${res.status}: ${res.stderr || res.stdout}`);
      assert.match(res.stdout, /UI guardrails passed/);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('exits with code 1 on invalid external fixture directory', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lims-cli-invalid-'));
    try {
      const invalidFile = path.join(tmpDir, 'invalid.component.html');
      fs.writeFileSync(invalidFile, `
        <app-page-header title="Lỗi" class="border shadow-md bg-white"></app-page-header>
      `);

      const scriptPath = path.resolve('scripts/ui-guardrails.js');
      const res = spawnSync(process.execPath, [scriptPath, '--source-root', tmpDir], { encoding: 'utf8' });
      assert.equal(res.status, 1, `Expected exit 1 but got ${res.status}`);
      assert.match(res.stderr, /app-page-header must not have borders, cards, shadows/);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
