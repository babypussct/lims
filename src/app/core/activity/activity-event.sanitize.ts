const MAX_DETAILS_LENGTH = 2_000;
const MAX_METADATA_KEYS = 40;
const MAX_METADATA_DEPTH = 4;
const MAX_METADATA_ARRAY_LENGTH = 50;
const MAX_METADATA_STRING_LENGTH = 1_000;

const SENSITIVE_METADATA_KEY = /(password|passwd|secret|token|credential|authorization|cookie|filedata|rawfile|rawcontent|privatekey)/i;

export function sanitizeActivityDetails(value: unknown): string {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) throw new Error('Activity details are required.');
  return normalized.slice(0, MAX_DETAILS_LENGTH);
}

export function sanitizeActivityMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const sanitized = sanitizeMetadataObject(metadata, 0);
  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function sanitizeMetadataObject(value: Record<string, unknown>, depth: number): Record<string, unknown> {
  if (depth >= MAX_METADATA_DEPTH) return {};
  const result: Record<string, unknown> = {};
  for (const [key, rawValue] of Object.entries(value).slice(0, MAX_METADATA_KEYS)) {
    if (SENSITIVE_METADATA_KEY.test(key)) continue;
    const safeValue = sanitizeMetadataValue(rawValue, depth + 1);
    if (safeValue !== undefined) result[key] = safeValue;
  }
  return result;
}

function sanitizeMetadataValue(value: unknown, depth: number): unknown {
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return undefined;
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.slice(0, MAX_METADATA_STRING_LENGTH);
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'bigint') return value.toString();
  if (depth >= MAX_METADATA_DEPTH) return undefined;
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_METADATA_ARRAY_LENGTH)
      .map(item => sanitizeMetadataValue(item, depth + 1))
      .filter(item => item !== undefined);
  }
  if (typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return undefined;
    return sanitizeMetadataObject(value as Record<string, unknown>, depth);
  }
  return undefined;
}
