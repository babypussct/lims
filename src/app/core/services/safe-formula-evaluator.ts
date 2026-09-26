export type FormulaPrimitive = number | string | boolean | null;

export const SAFE_CHEM_HELPERS = {
  dilute: (cStock: number, cTarget: number, vTarget: number) => cStock === 0 ? 0 : (cTarget * vTarget) / cStock,
  molarMass: (molarity: number, mw: number, volMl: number) => molarity * mw * (volMl / 1000),
  max: Math.max,
  min: Math.min,
  round: (num: number, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
} as const;

const SAFE_MATH_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  abs: Math.abs,
  acos: Math.acos,
  acosh: Math.acosh,
  asin: Math.asin,
  asinh: Math.asinh,
  atan: Math.atan,
  atanh: Math.atanh,
  atan2: Math.atan2,
  cbrt: Math.cbrt,
  ceil: Math.ceil,
  cos: Math.cos,
  cosh: Math.cosh,
  exp: Math.exp,
  floor: Math.floor,
  hypot: Math.hypot,
  log: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  round: Math.round,
  sign: Math.sign,
  sin: Math.sin,
  sinh: Math.sinh,
  sqrt: Math.sqrt,
  tan: Math.tan,
  tanh: Math.tanh,
  trunc: Math.trunc,
};

const SAFE_MATH_CONSTANTS: Record<string, number> = {
  E: Math.E,
  LN2: Math.LN2,
  LN10: Math.LN10,
  LOG2E: Math.LOG2E,
  LOG10E: Math.LOG10E,
  PI: Math.PI,
  SQRT1_2: Math.SQRT1_2,
  SQRT2: Math.SQRT2,
};

type TokenKind = 'number' | 'string' | 'identifier' | 'operator' | 'punctuation' | 'eof';
interface Token { kind: TokenKind; value: string; }

const MULTI_CHAR_OPERATORS = ['===', '!==', '**', '<=', '>=', '==', '!=', '&&', '||'];
const SINGLE_CHAR_TOKENS = new Set(['+', '-', '*', '/', '%', '<', '>', '!', '(', ')', ',', '.', '?', ':']);
const RESERVED_IDENTIFIERS = new Set([
  'globalThis', 'window', 'document', 'self', 'navigator', 'location', 'fetch',
  'XMLHttpRequest', 'WebSocket', 'localStorage', 'sessionStorage', 'indexedDB',
  'alert', 'confirm', 'prompt', 'eval', 'Function', 'constructor', 'prototype',
  '__proto__', 'import', 'require', 'process', 'class', 'function', 'new', 'this'
]);

function tokenize(expression: string): Token[] {
  if (!expression || expression.length > 500) throw new Error('Invalid formula length');
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];
    if (/\s/.test(char)) { i++; continue; }

    const operator = MULTI_CHAR_OPERATORS.find(op => expression.startsWith(op, i));
    if (operator) {
      tokens.push({ kind: 'operator', value: operator });
      i += operator.length;
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      i++;
      let value = '';
      let closed = false;
      while (i < expression.length) {
        const current = expression[i++];
        if (current === quote) { closed = true; break; }
        if (current === '\\') {
          if (i >= expression.length) throw new Error('Invalid string escape');
          const escaped = expression[i++];
          const escapes: Record<string, string> = { n: '\n', r: '\r', t: '\t', '\\': '\\', '"': '"', "'": "'" };
          value += escapes[escaped] ?? escaped;
        } else {
          value += current;
        }
      }
      if (!closed) throw new Error('Unterminated string');
      tokens.push({ kind: 'string', value });
      continue;
    }

    if (/\d/.test(char) || (char === '.' && /\d/.test(expression[i + 1] || ''))) {
      const start = i;
      if (char === '.') i++;
      while (/\d/.test(expression[i] || '')) i++;
      if (expression[i] === '.') {
        i++;
        while (/\d/.test(expression[i] || '')) i++;
      }
      if (/[eE]/.test(expression[i] || '')) {
        i++;
        if (/[+-]/.test(expression[i] || '')) i++;
        const exponentStart = i;
        while (/\d/.test(expression[i] || '')) i++;
        if (i === exponentStart) throw new Error('Invalid exponent');
      }
      const raw = expression.slice(start, i);
      if (!Number.isFinite(Number(raw))) throw new Error('Invalid number');
      tokens.push({ kind: 'number', value: raw });
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      const start = i++;
      while (/[A-Za-z0-9_$]/.test(expression[i] || '')) i++;
      tokens.push({ kind: 'identifier', value: expression.slice(start, i) });
      continue;
    }

    if (SINGLE_CHAR_TOKENS.has(char)) {
      tokens.push({
        kind: ['(', ')', ',', '.', '?', ':'].includes(char) ? 'punctuation' : 'operator',
        value: char
      });
      i++;
      continue;
    }

    throw new Error(`Unsupported formula token: ${char}`);
  }

  tokens.push({ kind: 'eof', value: '' });
  return tokens;
}

function toNumber(value: FormulaPrimitive): number {
  const result = Number(value);
  if (Number.isNaN(result)) throw new Error('Expected numeric value');
  return result;
}

function looseEqual(left: FormulaPrimitive, right: FormulaPrimitive): boolean {
  if (left === right) return true;
  if (left == null || right == null) return left == null && right == null;
  if (typeof left === 'boolean') return looseEqual(Number(left), right);
  if (typeof right === 'boolean') return looseEqual(left, Number(right));
  if (typeof left === 'number' && typeof right === 'string') return left === Number(right);
  if (typeof left === 'string' && typeof right === 'number') return Number(left) === right;
  return false;
}

class FormulaParser {
  private index = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly context: Record<string, unknown>
  ) {}

  parse(): FormulaPrimitive {
    const value = this.parseTernary();
    this.expect('eof');
    return value;
  }

  private current(): Token { return this.tokens[this.index]; }
  private consume(): Token { return this.tokens[this.index++]; }

  private match(value: string): boolean {
    if (this.current().value !== value) return false;
    this.index++;
    return true;
  }

  private expect(kindOrValue: TokenKind | string): Token {
    const token = this.current();
    if (token.kind !== kindOrValue && token.value !== kindOrValue) {
      throw new Error(`Expected ${kindOrValue}`);
    }
    return this.consume();
  }

  private parseTernary(): FormulaPrimitive {
    const condition = this.parseLogicalOr();
    if (!this.match('?')) return condition;
    const whenTrue = this.parseTernary();
    this.expect(':');
    const whenFalse = this.parseTernary();
    return condition ? whenTrue : whenFalse;
  }

  private parseLogicalOr(): FormulaPrimitive {
    let left = this.parseLogicalAnd();
    while (this.match('||')) {
      const right = this.parseLogicalAnd();
      left = left || right;
    }
    return left;
  }

  private parseLogicalAnd(): FormulaPrimitive {
    let left = this.parseEquality();
    while (this.match('&&')) {
      const right = this.parseEquality();
      left = left && right;
    }
    return left;
  }

  private parseEquality(): FormulaPrimitive {
    let left = this.parseComparison();
    while (['===', '!==', '==', '!='].includes(this.current().value)) {
      const operator = this.consume().value;
      const right = this.parseComparison();
      const equal = operator.length === 3 ? left === right : looseEqual(left, right);
      left = operator === '!=' || operator === '!==' ? !equal : equal;
    }
    return left;
  }

  private parseComparison(): FormulaPrimitive {
    let left = this.parseAdditive();
    while (['<', '<=', '>', '>='].includes(this.current().value)) {
      const operator = this.consume().value;
      const right = this.parseAdditive();
      if (operator === '<') left = left! < right!;
      else if (operator === '<=') left = left! <= right!;
      else if (operator === '>') left = left! > right!;
      else left = left! >= right!;
    }
    return left;
  }

  private parseAdditive(): FormulaPrimitive {
    let left = this.parseMultiplicative();
    while (this.current().value === '+' || this.current().value === '-') {
      const operator = this.consume().value;
      const right = this.parseMultiplicative();
      if (operator === '+') {
        left = typeof left === 'string' || typeof right === 'string'
          ? String(left ?? '') + String(right ?? '')
          : toNumber(left) + toNumber(right);
      } else {
        left = toNumber(left) - toNumber(right);
      }
    }
    return left;
  }

  private parseMultiplicative(): FormulaPrimitive {
    let left = this.parseExponent();
    while (['*', '/', '%'].includes(this.current().value)) {
      const operator = this.consume().value;
      const right = this.parseExponent();
      if (operator === '*') left = toNumber(left) * toNumber(right);
      else if (operator === '/') left = toNumber(left) / toNumber(right);
      else left = toNumber(left) % toNumber(right);
    }
    return left;
  }

  private parseExponent(): FormulaPrimitive {
    let left = this.parseUnary();
    if (this.match('**')) {
      const right = this.parseExponent();
      left = Math.pow(toNumber(left), toNumber(right));
    }
    return left;
  }

  private parseUnary(): FormulaPrimitive {
    if (this.match('!')) return !this.parseUnary();
    if (this.match('+')) return +toNumber(this.parseUnary());
    if (this.match('-')) return -toNumber(this.parseUnary());
    return this.parsePrimary();
  }

  private parsePrimary(): FormulaPrimitive {
    const token = this.current();
    if (token.kind === 'number') {
      this.consume();
      return Number(token.value);
    }
    if (token.kind === 'string') {
      this.consume();
      return token.value;
    }
    if (this.match('(')) {
      const value = this.parseTernary();
      this.expect(')');
      return value;
    }
    if (token.kind !== 'identifier') throw new Error('Expected formula value');

    const identifier = this.consume().value;
    if (RESERVED_IDENTIFIERS.has(identifier)) throw new Error('Reserved formula identifier');
    if (identifier === 'true') return true;
    if (identifier === 'false') return false;
    if (identifier === 'null') return null;
    if (identifier === 'undefined') return null;

    if (identifier === 'Math' || identifier === 'Chem') {
      this.expect('.');
      const member = this.expect('identifier').value;
      if (identifier === 'Math' && member in SAFE_MATH_CONSTANTS && this.current().value !== '(') {
        return SAFE_MATH_CONSTANTS[member];
      }
      this.expect('(');
      const args: FormulaPrimitive[] = [];
      if (!this.match(')')) {
        do { args.push(this.parseTernary()); } while (this.match(','));
        this.expect(')');
      }
      const fn = identifier === 'Math' ? SAFE_MATH_FUNCTIONS[member] : SAFE_CHEM_HELPERS[member as keyof typeof SAFE_CHEM_HELPERS];
      if (typeof fn !== 'function') throw new Error('Unsupported helper');
      return (fn as (...values: number[]) => number)(...args.map(toNumber));
    }

    if (!Object.prototype.hasOwnProperty.call(this.context, identifier)) {
      throw new Error(`Unknown formula variable: ${identifier}`);
    }
    const value = this.context[identifier];
    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || value === null) {
      return value;
    }
    throw new Error('Formula variables must be primitive values');
  }
}

export function evaluateSafeFormula(
  formula: string,
  context: Record<string, unknown>
): FormulaPrimitive | null {
  try {
    return new FormulaParser(tokenize(formula), context).parse();
  } catch {
    return null;
  }
}
