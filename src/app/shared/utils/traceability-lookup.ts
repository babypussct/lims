/** Normalize printed traceability links and literal IDs without changing ID case. */
export function normalizeTraceabilityLookup(rawValue: string): string {
  let value = rawValue.trim();
  if (!value) return '';

  try {
      const parsedUrl = new URL(value, 'https://lims.local');
      const hashMatch = parsedUrl.hash.match(/#\/traceability\/([^/?#]+)/i);
      const pathMatch = parsedUrl.pathname.match(/\/traceability\/([^/?#]+)/i);
      const queryId = parsedUrl.searchParams.get('id');

      if (hashMatch?.[1]) {
          value = hashMatch[1];
      } else if (pathMatch?.[1]) {
          value = pathMatch[1];
      } else if (queryId) {
          value = queryId;
      }
  } catch {
      const routeMatch = value.match(/(?:#\/)?traceability\/([^/?#]+)/i);
      if (routeMatch?.[1]) {
          value = routeMatch[1];
      }
  }

  try {
      value = decodeURIComponent(value);
  } catch {
      // Keep the original value when it is not valid URI-encoded text.
  }

  return value.trim();
}

/** Offer arbitrary IDs as a fallback while prioritizing recognized traceability codes. */
export function getTraceabilitySearchCandidate(rawValue: string): { code: string; preferred: boolean } | null {
  const code = normalizeTraceabilityLookup(rawValue);
  if (!code || code.length > 200 || /[\/\s\u0000-\u001f\u007f]/.test(code)) return null;

  return {
    code,
    preferred: /^(?:TRC-|REQ-|LOG-|log_)/i.test(code)
      || /^[a-zA-Z0-9]{20}$/.test(code)
      || code !== rawValue.trim()
  };
}
