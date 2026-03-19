export interface Gs1Data {
  gtin?: string;
  lotNumber?: string;
  expiryDate?: string; // YYYY-MM-DD
  raw?: string;
  isGs1: boolean;
  error?: string;
}

export function parseGs1Data(code: string): Gs1Data {
  const result: Gs1Data = { isGs1: false, raw: code };
  
  if (!code) {
    result.error = 'Mã vạch trống';
    return result;
  }

  // Replace common FNC1 separators if present (ASCII 29)
  let cleanCode = code.replace(/\x1D/g, '{GS}');
  
  // Remove symbology identifiers if present (e.g., ]d2 for GS1 DataMatrix, ]C1 for GS1-128)
  let hasSymbology = false;
  if (cleanCode.startsWith(']d2') || cleanCode.startsWith(']C1') || cleanCode.startsWith(']e0')) {
    cleanCode = cleanCode.substring(3);
    hasSymbology = true;
  }
  
  // Basic check: if it starts with 01 and is long enough
  if (!cleanCode.startsWith('01') || cleanCode.length < 16) {
    if (hasSymbology) {
      result.isGs1 = true;
      result.error = 'Mã vạch GS1 không hợp lệ hoặc thiếu GTIN (AI 01)';
    }
    return result;
  }
  
  result.isGs1 = true;
  let i = 0;
  
  try {
    while (i < cleanCode.length) {
      const ai = cleanCode.substring(i, i + 2);
      
      if (ai === '01') {
        i += 2;
        result.gtin = cleanCode.substring(i, i + 14);
        i += 14;
      } else if (ai === '17') {
        i += 2;
        const dateStr = cleanCode.substring(i, i + 6);
        if (dateStr.length === 6) {
          const year = parseInt(dateStr.substring(0, 2), 10) + 2000;
          const month = dateStr.substring(2, 4);
          const day = dateStr.substring(4, 6) === '00' ? '01' : dateStr.substring(4, 6); // Handle 00 day (last day of month, but we just use 01 for simplicity or exact date)
          result.expiryDate = `${year}-${month}-${day}`;
        }
        i += 6;
      } else if (ai === '11') {
        i += 2;
        i += 6; // Skip production date
      } else if (ai === '10') {
        i += 2;
        // Variable length, up to 20 chars, terminated by {GS} or end of string
        let end = cleanCode.indexOf('{GS}', i);
        if (end === -1) end = cleanCode.length;
        result.lotNumber = cleanCode.substring(i, end);
        i = end + 4; // Skip {GS} if found
        if (end === cleanCode.length) break;
      } else if (ai === '21') {
        i += 2;
        let end = cleanCode.indexOf('{GS}', i);
        if (end === -1) end = cleanCode.length;
        i = end + 4;
        if (end === cleanCode.length) break;
      } else if (ai === '240') {
        i += 3; // AI 240 is 3 chars
        let end = cleanCode.indexOf('{GS}', i);
        if (end === -1) end = cleanCode.length;
        i = end + 4;
        if (end === cleanCode.length) break;
      } else {
        // Unknown AI, we might get stuck if it's variable length and no {GS} is present.
        // For safety, if we hit an unknown AI, we just break.
        break;
      }
    }
  } catch (e) {
    result.error = 'Lỗi phân tích cú pháp GS1';
    console.error('GS1 Parse Error:', e);
  }
  
  return result;
}
