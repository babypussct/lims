export interface DutyShift {
  date: string;
  people: string[];
  sourceFile: string;
  rawText: string;
}

export interface DutyPersonStat {
  name: string;
  count: number;
  mondayCount: number;
  monthCount: number;
  lastDate: string;
}

export interface DutyMonthStat {
  monthKey: string;
  shiftCount: number;
  assignmentCount: number;
  peopleCount: number;
}

export interface DutyFilters {
  year?: number | null;
  month?: number | null;
  person?: string | null;
}

export interface DutyParseResult {
  shifts: DutyShift[];
  unresolvedFragments: string[];
  sourceFiles: string[];
}

const EXACT_ALIASES: Record<string, string> = {
  ho: 'Hồ',
  huynh: 'Huynh',
  husan: 'Huỳnh',
  huwnh: 'Huỳnh',
  phong: 'Phong',
  phuong: 'Phương',
  hanh: 'H.Anh',
  viet: 'Việt',
  nghia: 'Nghĩa',
  son: 'Sơn',
  som: 'Sơn',
  thiet: 'Thiệt',
  minh: 'Minh',
  nha: 'Nhã',
  tam: 'Tâm',
  chuong: 'Chương',
  chumme: 'Chương',
  di: 'Di',
  ben: 'Bên',
  khoi: 'Khôi',
  khsi: 'Khôi',
  trai: 'Trãi',
  thanh: 'Thành',
};

export function foldDutyName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

export function normalizeDutyPerson(fragment: string): string | null {
  const cleaned = fragment
    .normalize('NFC')
    .trim()
    .replace(/^[\s|,&;:]+|[\s|,&;:]+$/g, '')
    .trim();
  const rawLower = cleaned.toLocaleLowerCase('vi-VN');
  // Huỳnh và Huynh là hai nhân sự khác nhau. Phải kiểm tra chuỗi gốc có dấu
  // trước khi fold diacritics, nếu không cả hai sẽ cùng trở thành "huynh".
  if (rawLower === 'huỳnh') return 'Huỳnh';
  if (rawLower === 'huynh') return 'Huynh';

  const folded = foldDutyName(fragment);
  if (!folded || folded === 'is') return null;

  if (folded.startsWith('dat') || folded.startsWith('dai')) {
    if (
      /\(\s*n/i.test(fragment)
      || /\/\s*n/i.test(fragment)
      || folded.includes('datn')
      || folded.includes('dain')
      || folded.includes('datad')
    ) {
      return 'Đạt (N)';
    }
    if (
      /\(\s*[o0q]/i.test(fragment)
      || folded.includes('dato')
      || folded.includes('datq')
    ) {
      return 'Đạt (O)';
    }
    return 'Đạt';
  }

  if (folded.startsWith('kho') || folded === 'khsi') return 'Khôi';
  if (folded.startsWith('chu')) return 'Chương';
  if (folded.startsWith('phu')) return 'Phương';
  if (folded.startsWith('thi')) return 'Thiệt';
  if (folded.startsWith('vie')) return 'Việt';
  if (folded.startsWith('son') || folded === 'som') return 'Sơn';
  if (folded.startsWith('nha')) return 'Nhã';
  if (folded.startsWith('tra')) return 'Trãi';
  if (folded.startsWith('tam')) return 'Tâm';

  return EXACT_ALIASES[folded] ?? null;
}

function splitDutyPeople(rawText: string): { people: string[]; unresolved: string[] } {
  const foldedRaw = foldDutyName(rawText);
  if (foldedRaw.includes('02dat') && /\([o0]&n\)/i.test(rawText)) {
    return { people: ['Đạt (O)', 'Đạt (N)'], unresolved: [] };
  }

  const fragments = rawText
    .split(/[|,&]+/)
    .map(value => value.trim())
    .filter(Boolean);

  const people: string[] = [];
  const unresolved: string[] = [];
  for (const fragment of fragments) {
    const normalized = normalizeDutyPerson(fragment);
    if (normalized) {
      people.push(normalized);
      continue;
    }

    const folded = foldDutyName(fragment);
    if (
      !folded
      || /^\d+$/.test(folded)
      || folded === 'is'
      || folded === 'n'
      || folded === 'o'
      || folded === '0'
    ) {
      continue;
    }
    unresolved.push(fragment);
  }

  return {
    people: [...new Set(people)],
    unresolved,
  };
}

export function parseDutyScheduleOcr(raw: string): DutyParseResult {
  const shifts: DutyShift[] = [];
  const unresolved = new Set<string>();
  const sourceFiles = new Set<string>();
  let sourceFile = '';

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      sourceFile = line.slice(4).trim();
      sourceFiles.add(sourceFile);
      continue;
    }

    const tabIndex = line.indexOf('\t');
    if (tabIndex < 0 || !/^\d{4}-\d{2}-\d{2}$/.test(line.slice(0, tabIndex))) {
      continue;
    }

    const date = line.slice(0, tabIndex);
    const rawText = line.slice(tabIndex + 1).trim();
    const parsed = splitDutyPeople(rawText);
    for (const fragment of parsed.unresolved) unresolved.add(fragment);

    if (parsed.people.length === 0) continue;
    shifts.push({
      date,
      people: parsed.people,
      sourceFile,
      rawText,
    });
  }

  return {
    shifts: shifts.sort((a, b) => a.date.localeCompare(b.date)),
    unresolvedFragments: [...unresolved].sort((a, b) => a.localeCompare(b, 'vi')),
    sourceFiles: [...sourceFiles],
  };
}

export function filterDutyShifts(shifts: DutyShift[], filters: DutyFilters): DutyShift[] {
  return shifts.filter(shift => {
    const year = Number(shift.date.slice(0, 4));
    const month = Number(shift.date.slice(5, 7));
    if (filters.year && year !== filters.year) return false;
    if (filters.month && month !== filters.month) return false;
    if (filters.person && !shift.people.includes(filters.person)) return false;
    return true;
  });
}

export function aggregateDutyPeople(shifts: DutyShift[]): DutyPersonStat[] {
  const stats = new Map<string, {
    count: number;
    mondayCount: number;
    months: Set<string>;
    lastDate: string;
  }>();

  for (const shift of shifts) {
    const weekday = new Date(`${shift.date}T12:00:00+07:00`).getDay();
    const monthKey = shift.date.slice(0, 7);
    for (const person of shift.people) {
      const current = stats.get(person) ?? {
        count: 0,
        mondayCount: 0,
        months: new Set<string>(),
        lastDate: '',
      };
      current.count += 1;
      if (weekday === 1) current.mondayCount += 1;
      current.months.add(monthKey);
      if (!current.lastDate || shift.date > current.lastDate) current.lastDate = shift.date;
      stats.set(person, current);
    }
  }

  return [...stats.entries()]
    .map(([name, stat]) => ({
      name,
      count: stat.count,
      mondayCount: stat.mondayCount,
      monthCount: stat.months.size,
      lastDate: stat.lastDate,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'vi'));
}

export function aggregateDutyMonths(shifts: DutyShift[]): DutyMonthStat[] {
  const stats = new Map<string, {
    shiftCount: number;
    assignmentCount: number;
    people: Set<string>;
  }>();

  for (const shift of shifts) {
    const monthKey = shift.date.slice(0, 7);
    const current = stats.get(monthKey) ?? {
      shiftCount: 0,
      assignmentCount: 0,
      people: new Set<string>(),
    };
    current.shiftCount += 1;
    current.assignmentCount += shift.people.length;
    shift.people.forEach(person => current.people.add(person));
    stats.set(monthKey, current);
  }

  return [...stats.entries()]
    .map(([monthKey, stat]) => ({
      monthKey,
      shiftCount: stat.shiftCount,
      assignmentCount: stat.assignmentCount,
      peopleCount: stat.people.size,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function countDutyAssignments(shifts: DutyShift[]): number {
  return shifts.reduce((total, shift) => total + shift.people.length, 0);
}
