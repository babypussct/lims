const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const ngswPath = path.join(__dirname, '../ngsw-config.json');
const statePath = path.join(__dirname, '../src/app/core/services/state.service.ts');
const metadataPath = path.join(__dirname, '../metadata.json');

// 1. Tính toán chuỗi Ngày hiện tại (YY.MM.DD)
const now = new Date();
const yy = String(now.getFullYear()).slice(-2);
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const todayPrefix = `${yy}.${mm}.${dd}`;

// 2. Đọc package.json để kiểm tra lượt build trong ngày
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
let buildNum = 1;

// Nếu version trong package.json đã là của ngày hôm nay thì tự động +1 lượt build
if (pkg.version && pkg.version.startsWith(todayPrefix)) {
  const match = pkg.version.match(/-b(\d+)$/);
  if (match) {
    buildNum = parseInt(match[1], 10) + 1;
  }
}

const buildNumStr = String(buildNum).padStart(2, '0');
const newVersion = `${todayPrefix}-b${buildNumStr}`; // Kết quả ví dụ: 26.07.21-b01

// 3. Ghi số phiên bản mới vào package.json
pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`[Auto-Version] 🚀 Đã phát sinh phiên bản: v${newVersion}`);

// 4. Đồng bộ vào ngsw-config.json (Cho popup cập nhật)
if (fs.existsSync(ngswPath)) {
  let ngswContent = fs.readFileSync(ngswPath, 'utf8');
  const ngswRegex = /"version":\s*"[^"]+"/g;
  ngswContent = ngswContent.replace(ngswRegex, `"version": "v${newVersion}"`);
  fs.writeFileSync(ngswPath, ngswContent);
  console.log('✅ Đã đồng bộ ngsw-config.json');
  console.log('⚠️  Bắt buộc cập nhật appData.notesVersion, title và features trước khi build release.');
}

// 5. Đồng bộ vào state.service.ts (Cho Login & Header)
if (fs.existsSync(statePath)) {
  let stateContent = fs.readFileSync(statePath, 'utf8');
  const stateRegex = /systemVersion\s*=\s*signal<string>\('[^']+'\);/g;
  stateContent = stateContent.replace(stateRegex, `systemVersion = signal<string>('v${newVersion}');`);
  fs.writeFileSync(statePath, stateContent);
  console.log('✅ Đã đồng bộ state.service.ts');
}

// 6. Đồng bộ vào metadata.json
if (fs.existsSync(metadataPath)) {
  let metadataContent = fs.readFileSync(metadataPath, 'utf8');
  const metaRegex = /"name":\s*"LIMS Cloud [^"]+"/g;
  metadataContent = metadataContent.replace(metaRegex, `"name": "LIMS Cloud v${newVersion}"`);
  fs.writeFileSync(metadataPath, metadataContent);
  console.log('✅ Đã đồng bộ metadata.json');
}

console.log('🎉 Hoàn tất tự động đánh số phiên bản!');
