/**
 * Builds the idempotency key used by the GAS `generate_pdf` mutation.
 *
 * GAS fingerprints the complete generate_pdf payload (sopId, metadata,
 * samples and version). The request ID therefore has to change when any of
 * those values change, while remaining stable when the exact same payload is
 * retried after a network or Firestore failure.
 */

const FNV64_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV64_PRIME = 0x100000001b3n;
const FNV64_MASK = 0xffffffffffffffffn;

function stableStringify(value: unknown): string {
  if (value === null) return 'null';

  if (Array.isArray(value)) {
    return `[${value.map(item => stableStringify(item)).join(',')}]`;
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const toJson = objectValue['toJSON'];
    if (typeof toJson === 'function') {
      return stableStringify(toJson.call(value));
    }

    const keys = Object.keys(objectValue)
      .filter(key => objectValue[key] !== undefined)
      .sort();

    return `{${keys
      .map(key => `${JSON.stringify(key)}:${stableStringify(objectValue[key])}`)
      .join(',')}}`;
  }

  if (typeof value === 'number' && !Number.isFinite(value)) {
    return 'null';
  }

  const serialized = JSON.stringify(value);
  return serialized === undefined ? 'null' : serialized;
}

function fnv1a64(value: string): string {
  let hash = FNV64_OFFSET_BASIS;
  for (let index = 0; index < value.length; index++) {
    hash ^= BigInt(value.charCodeAt(index));
    hash = (hash * FNV64_PRIME) & FNV64_MASK;
  }
  return hash.toString(16).padStart(16, '0');
}

export interface GeneratePdfRequestIdInput {
  batchRequestId: string;
  version: number;
  prefix?: string;
  includedSamples?: readonly string[];
  sopId: string;
  metadata: unknown;
  samples: unknown;
}

/**
 * Return a stable request ID for one logical PDF payload.
 *
 * The v2 marker deliberately prevents a stale v1 key, created by older
 * frontend bundles, from colliding with the new payload-aware key format.
 */
export function buildGeneratePdfRequestId(input: GeneratePdfRequestIdInput): string {
  const reportScope = `${input.prefix ?? 'ALL'}|${[...(input.includedSamples || [])].sort().join(',')}`;
  const scopeHash = fnv1a64(reportScope);
  const payloadHash = fnv1a64(stableStringify({
    action: 'generate_pdf',
    sopId: input.sopId,
    metadata: input.metadata,
    samples: input.samples,
    version: input.version,
  }));

  return `pdf:v2:${input.batchRequestId}:v${input.version}:${scopeHash}:${payloadHash}`;
}
