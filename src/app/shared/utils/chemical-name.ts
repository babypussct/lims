const PROTECTED_UPPERCASE_IDENTIFIERS = new Set([
  'ATP', 'BHC', 'BPA', 'CAS', 'CRM', 'DDD', 'DDE', 'DDT', 'DNA', 'DTPA',
  'EDTA', 'EPA', 'GC', 'HCH', 'ICP', 'ISO', 'LC', 'MS', 'PAH', 'PCB', 'PCBS',
  'PFOA', 'PFOS', 'RNA', 'WHO',
]);

/**
 * Formats a chemical name for display using sentence case while preserving
 * mixed-case scientific tokens (for example NaCl, DDT, N-, R- and L-).
 */
export function formatChemicalName(name: string): string {
  if (typeof name !== 'string') return '';

  let formatted = name.trim().replace(/\s+/g, ' ');
  if (!formatted) return '';

  const letters = formatted.match(/\p{L}/gu) ?? [];
  const hasLowercase = letters.some(char => char === char.toLocaleLowerCase() && char !== char.toLocaleUpperCase());
  const hasUppercase = letters.some(char => char === char.toLocaleUpperCase() && char !== char.toLocaleLowerCase());
  const uppercaseTokensToRestore = new Set(
    (formatted.match(/[A-Z]+/gu) ?? []).filter(token => PROTECTED_UPPERCASE_IDENTIFIERS.has(token))
  );
  const isProtectedUppercaseIdentifier = PROTECTED_UPPERCASE_IDENTIFIERS.has(formatted)
    || (/\d/u.test(formatted) && !/\s/u.test(formatted) && letters.length <= 5);

  // Vendor/import data is often ALL CAPS. Keep short identifiers such as DDT,
  // but normalize actual names before applying sentence case.
  if (hasUppercase && !hasLowercase && !isProtectedUppercaseIdentifier) {
    formatted = formatted.toLocaleLowerCase('en-US');
  }

  // These nomenclature prefixes conventionally remain lowercase. A numeric
  // letter locant such as 6a- follows the same display pattern.
  const hasLowercaseNomenclaturePrefix = /^(?:cis|trans|sec|tert|alpha|beta|gamma|delta|epsilon|ortho|meta|para|[αβγδε])-/iu.test(formatted)
    || /^[noms]-/u.test(formatted);
  const hasNumericLetterLocant = /^\d+[a-z](?:[,']?\d*[a-z]?)*-/iu.test(formatted);
  const primaryWordIndex = hasLowercaseNomenclaturePrefix || hasNumericLetterLocant ? 1 : 0;

  let wordIndex = 0;
  formatted = formatted.replace(/\p{L}[\p{L}\p{M}]*/gu, word => {
    const currentIndex = wordIndex++;
    if (currentIndex <= primaryWordIndex || word.length === 1) return word;

    // Lowercase only Title-Cased words. Acronyms and mixed-case formulae are
    // intentionally kept intact because their case carries meaning.
    if (/^\p{Lu}[\p{Ll}\p{M}]+$/u.test(word)) {
      return word.toLocaleLowerCase('en-US');
    }
    return word;
  });

  // Capitalize the display-bearing word. Prefixes such as cis- and locants
  // such as 6a- stay lowercase, while the following name begins with a capital.
  let capitalizationWordIndex = 0;
  formatted = formatted.replace(/\p{L}[\p{L}\p{M}]*/gu, word => {
    const currentIndex = capitalizationWordIndex++;
    if (currentIndex !== primaryWordIndex) return word;
    const firstLetter = word[0];
    if (firstLetter === firstLetter.toLocaleLowerCase() && firstLetter !== firstLetter.toLocaleUpperCase()) {
      return firstLetter.toLocaleUpperCase('en-US') + word.slice(1);
    }
    return word;
  });

  if (hasLowercaseNomenclaturePrefix || hasNumericLetterLocant) {
    const prefixEnd = formatted.indexOf('-');
    formatted = formatted.slice(0, prefixEnd).toLocaleLowerCase('en-US') + formatted.slice(prefixEnd);
  }

  if (uppercaseTokensToRestore.size > 0) {
    formatted = formatted.replace(/\p{L}+/gu, word => {
      const uppercaseWord = word.toLocaleUpperCase('en-US');
      return uppercaseTokensToRestore.has(uppercaseWord) ? uppercaseWord : word;
    });
  }

  return formatted;
}

/** Parse the editor value without splitting commas used inside nomenclature. */
export function parseChemicalNames(value: string): string[] {
  if (!value) return [];
  return value
    .split(/(?:\r?\n|;)+/u)
    .map(item => item.trim())
    .filter(Boolean);
}

export function normalizeChemicalNames(names: Iterable<string>, excludedNames: Iterable<string> = []): string[] {
  const excluded = new Set(
    Array.from(excludedNames, name => formatChemicalName(name).toLocaleLowerCase('en-US')).filter(Boolean)
  );
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawName of names) {
    const formatted = formatChemicalName(rawName);
    const key = formatted.toLocaleLowerCase('en-US');
    if (!formatted || excluded.has(key) || seen.has(key)) continue;
    seen.add(key);
    result.push(formatted);
  }

  return result;
}

export function serializeChemicalNames(names: Iterable<string>): string {
  return normalizeChemicalNames(names).join('; ');
}

/** Normalize and validate a CAS Registry Number, including its check digit. */
export function normalizeCasNumber(value: string | null | undefined): string | null {
  if (!value) return null;
  const compact = value.trim().replace(/[\s\u2012-\u2015]+/gu, '').replace(/-/gu, '');
  if (!/^\d{5,10}$/u.test(compact)) return null;

  const body = compact.slice(0, -1);
  const checkDigit = Number(compact.at(-1));
  const checksum = Array.from(body)
    .reverse()
    .reduce((sum, digit, index) => sum + Number(digit) * (index + 1), 0) % 10;
  if (checksum !== checkDigit) return null;

  return `${body.slice(0, -2)}-${body.slice(-2)}-${checkDigit}`;
}
