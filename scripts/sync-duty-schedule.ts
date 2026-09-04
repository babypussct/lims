import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const folder = process.argv[2];
if (!folder) {
  console.error('Usage: npm run sync:duty-schedule -- "/path/to/lich truc"');
  process.exit(2);
}

const repoRoot = process.cwd();
const extractor = resolve(repoRoot, 'scripts/extract-duty-schedule.swift');
const target = resolve(
  repoRoot,
  'src/app/features/duty-stats/duty-schedule.data.ts',
);

const ocr = execFileSync('swift', [extractor, folder], {
  cwd: repoRoot,
  encoding: 'utf8',
}).trim();

const escaped = ocr
  .replace(/\\/g, '\\\\')
  .replace(/\`/g, '\\\`')
  .replace(/\$\{/g, '\\$\{');

const source = `import { parseDutyScheduleOcr } from './duty-stats.utils';

/**
 * Generated from the duty-schedule image folder.
 * Run: npm run sync:duty-schedule -- "/path/to/lich truc"
 */
export const DUTY_SCHEDULE_OCR = \`
${escaped}
\`.trim();

export const DUTY_SCHEDULE_DATA = parseDutyScheduleOcr(DUTY_SCHEDULE_OCR);
export const DUTY_SHIFTS = DUTY_SCHEDULE_DATA.shifts;
`;

writeFileSync(target, source, 'utf8');
console.log(`Duty schedule synced to ${target}`);
