/**
 * Converts the timestamp shapes used by Firestore, DeltaSync's JSON cache and
 * legacy records into epoch milliseconds. Invalid or incomplete values fail
 * closed with null instead of producing an Invalid Date.
 */
export function timestampToMillis(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date) {
    const millis = value.getTime();
    return Number.isFinite(millis) ? millis : null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const millis = Date.parse(value);
    return Number.isFinite(millis) ? millis : null;
  }

  if (typeof value !== 'object') return null;

  const timestamp = value as {
    seconds?: unknown;
    nanoseconds?: unknown;
    milliseconds?: unknown;
    _seconds?: unknown;
    _nanoseconds?: unknown;
    toMillis?: unknown;
    toDate?: unknown;
  };

  try {
    if (typeof timestamp.toMillis === 'function') {
      const millis = (timestamp.toMillis as () => number)();
      return Number.isFinite(millis) ? millis : null;
    }
    if (typeof timestamp.toDate === 'function') {
      const date = (timestamp.toDate as () => Date)();
      const millis = date?.getTime();
      return Number.isFinite(millis) ? millis : null;
    }
  } catch {
    return null;
  }

  if (typeof timestamp.milliseconds === 'number' && Number.isFinite(timestamp.milliseconds)) {
    return timestamp.milliseconds;
  }

  const seconds = typeof timestamp.seconds === 'number'
    ? timestamp.seconds
    : timestamp._seconds;
  const nanoseconds = typeof timestamp.nanoseconds === 'number'
    ? timestamp.nanoseconds
    : timestamp._nanoseconds;

  if (typeof seconds === 'number' && Number.isFinite(seconds)) {
    const nanos = typeof nanoseconds === 'number' && Number.isFinite(nanoseconds)
      ? nanoseconds
      : 0;
    return (seconds * 1000) + Math.floor(nanos / 1_000_000);
  }

  return null;
}

export function timestampToDate(value: unknown): Date | null {
  const millis = timestampToMillis(value);
  if (millis === null) return null;
  const date = new Date(millis);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function timestampToLocalDateKey(value: unknown): string | null {
  const date = timestampToDate(value);
  if (!date) return null;
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}
