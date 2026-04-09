import { Injectable } from '@angular/core';

export const GHS_DICTIONARY: Record<string, {label: string, iconUrl: string}> = {
    'GHS01': { label: 'Explosive (Dễ Nổ)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/GHS-pictogram-explos.svg' },
    'GHS02': { label: 'Flammable (Dễ Cháy)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/GHS-pictogram-flamme.svg' },
    'GHS03': { label: 'Oxidizing (Chất Oxy hóa)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/GHS-pictogram-rondflam.svg' },
    'GHS04': { label: 'Compressed Gas (Khí nén)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/GHS-pictogram-bottle.svg' },
    'GHS05': { label: 'Corrosive (Ăn Mòn)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/GHS-pictogram-acid.svg' },
    'GHS06': { label: 'Toxic (Cấp Độc tính 1-3)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/GHS-pictogram-skull.svg' },
    'GHS07': { label: 'Harmful (Độc tính - Kích ứng)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/GHS-pictogram-exclam.svg' },
    'GHS08': { label: 'Health Hazard (Nguy hiểm Đa tạng)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/GHS-pictogram-silhouette.svg' },
    'GHS09': { label: 'Environmental Hazard (Độc Môi trường)', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/GHS-pictogram-pollu.svg' }
};

@Injectable({ providedIn: 'root' })
export class PubchemService {

  async fetchGHS(query: string): Promise<string[]> {
    if (!query) return [];
    const sanitizedQuery = query.trim();
    
    try {
        // 1. Lấy thông số CID thông qua Tên tiếng anh hoặc CAS
        // PUG REST API 'name' có thể chấp nhận cả chuỗi CAS e.g 67-56-1
        const cidRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(sanitizedQuery)}/cids/JSON`);
        if (!cidRes.ok) return [];
        const cidData = await cidRes.json();
        const cid = cidData.IdentifierList?.CID?.[0];
        if (!cid) return [];

        // 2. Kéo dữ liệu An toàn PUG VIEW
        const pugViewRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`);
        if (!pugViewRes.ok) return [];
        const pugViewData = await pugViewRes.json();
        
        let foundGHS = new Set<string>();

        // Cây cấu trúc JSon của PugView rất phức tạp, ta dùng đệ quy tìm cạn Text
        const extractGhsRecursive = (obj: any) => {
            if (typeof obj === 'string') {
                const match = obj.match(/GHS0[1-9]/g);
                if (match) {
                    match.forEach(m => foundGHS.add(m));
                }
            } else if (Array.isArray(obj)) {
                obj.forEach(o => extractGhsRecursive(o));
            } else if (typeof obj === 'object' && obj !== null) {
                Object.values(obj).forEach(v => extractGhsRecursive(v));
            }
        };

        extractGhsRecursive(pugViewData);
        
        return Array.from(foundGHS).sort();

    } catch (e) {
        console.error("PubChem Fetch Error:", e);
        return [];
    }
  }
}
