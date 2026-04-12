import { Injectable } from '@angular/core';

export const GHS_DICTIONARY: Record<string, {label: string, iconUrl: string, precautions: string[]}> = {
    'GHS01': { 
        label: 'Explosive (Chất nổ)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/GHS-pictogram-explos.svg',
        precautions: ['Tránh xa nguồn nhiệt, tia lửa, ngọn lửa trần.', 'Không để bị sốc vật lý hoặc ma sát mạnh.']
    },
    'GHS02': { 
        label: 'Flammable (Dễ cháy)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/GHS-pictogram-flamme.svg',
        precautions: ['Tránh xa nguồn nhiệt, bề mặt nóng, ngọn lửa trần. Không hút thuốc.', 'Nối đất bình chứa và thiết bị tiếp nhận.', 'Sử dụng dụng cụ không phát sinh tia lửa.']
    },
    'GHS03': { 
        label: 'Oxidizing (Chất oxy hóa)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/GHS-pictogram-rondflam.svg',
        precautions: ['Để xa quần áo và các vật liệu dễ cháy.', 'Không trộn lẫn với chất dễ bắt cháy.']
    },
    'GHS04': { 
        label: 'Compressed Gas (Khí nén/Khí hóa lỏng)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/GHS-pictogram-bottle.svg',
        precautions: ['Bảo vệ tránh ánh nắng mặt trời.', 'Bảo quản nơi thông thoáng.']
    },
    'GHS05': { 
        label: 'Corrosive (Ăn Mòn)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/GHS-pictogram-acid.svg',
        precautions: ['Tránh hít hơi sương, không để dính vào mắt, da, quần áo.', 'Bắt buộc mang kính bảo hộ chống hóa chất, găng tay cao su/nitrile.']
    },
    'GHS06': { 
        label: 'Toxic (Độc tính cấp)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/58/GHS-pictogram-skull.svg',
        precautions: ['KHÔNG được nuốt, hít, hoặc để chạm vào da.', 'Bắt buộc thao tác trong tủ hút khí độc.', 'Rửa tay thật kỹ sau khi xử lý.']
    },
    'GHS07': { 
        label: 'Harmful/Irritant (Báo động/Nguy hại sức khoẻ)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/GHS-pictogram-exclam.svg',
        precautions: ['Tránh hít phải khói, bụi, hơi, bụi sương.', 'Chỉ sử dụng ngoài trời hoặc nơi thông thoáng.', 'Mang thiết bị bảo hộ cá nhân cần thiết.']
    },
    'GHS08': { 
        label: 'Health Hazard (Nguy hiểm sức khỏe)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/GHS-pictogram-silhouette.svg',
        precautions: ['Đọc kỹ hướng dẫn an toàn trước khi sử dụng.', 'Không tiếp xúc trước khi đã hiểu mọi biện pháp an toàn.']
    },
    'GHS09': { 
        label: 'Environmental Hazard (Nguy hại môi trường)', 
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/GHS-pictogram-pollu.svg',
        precautions: ['Tránh thải trực tiếp ra môi trường.', 'Thu gom vật liệu tràn đổ đúng quy định an toàn hóa chất.']
    }
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
                // Lấy GHS Icons
                const matchIcon = obj.match(/GHS0[1-9]/g);
                if (matchIcon) {
                    matchIcon.forEach(m => foundGHS.add(m));
                }
                
                // Lấy Mã H (Hazard Statements) và P (Precautionary)
                // Format PubChem: "H317: May cause an allergic skin reaction [Warning...]"
                const matchHP = obj.match(/^(?:H|P)[0-9]{3}.+?(?=\[|$)/g);
                if (matchHP) {
                    matchHP.forEach(m => foundGHS.add(m.trim().replace(/\s*\([^)]*\)\s*:/, ':'))); // remove (99.8%) etc.
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
