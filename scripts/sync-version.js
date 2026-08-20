const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const ngswPath = path.join(__dirname, '../ngsw-config.json');
const statePath = path.join(__dirname, '../src/app/core/services/state.service.ts');
const metadataPath = path.join(__dirname, '../metadata.json');
const releaseNotesPath = path.join(__dirname, '../release-notes.json');

function readReleaseNotes() {
  if (!fs.existsSync(releaseNotesPath)) {
    throw new Error('Không tìm thấy release-notes.json. Hãy tạo nội dung release trước khi đồng bộ phiên bản.');
  }

  let notes;
  try {
    notes = JSON.parse(fs.readFileSync(releaseNotesPath, 'utf8'));
  } catch (error) {
    throw new Error(`release-notes.json không phải JSON hợp lệ: ${error.message}`);
  }

  if (!notes || typeof notes !== 'object' || typeof notes.title !== 'string' || !notes.title.trim()) {
    throw new Error('release-notes.json phải có trường title không trống.');
  }

  const sections = ['highlights', 'features', 'improvements', 'fixes'];
  for (const section of sections) {
    if (!Array.isArray(notes[section])) {
      throw new Error(`release-notes.json.${section} là mục bắt buộc và phải là một mảng (có thể để []).`);
    }
  }

  return notes;
}

const releaseNotes = readReleaseNotes();

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

// 4. Đồng bộ vào ngsw-config.json (Cho popup cập nhật + nội dung release)
if (fs.existsSync(ngswPath)) {
  const ngswConfig = JSON.parse(fs.readFileSync(ngswPath, 'utf8'));
  const featureSections = ['highlights', 'features', 'improvements', 'fixes'];
  const features = featureSections
    .flatMap(section => releaseNotes[section] || [])
    .filter(feature => typeof feature === 'string' && feature.trim())
    .map(feature => feature.trim())
    .slice(0, 5);

  ngswConfig.appData = {
    ...(ngswConfig.appData || {}),
    version: `v${newVersion}`,
    title: releaseNotes.title.trim(),
    features
  };
  delete ngswConfig.appData.notesVersion;

  fs.writeFileSync(ngswPath, JSON.stringify(ngswConfig, null, 2) + '\n');
  console.log('✅ Đã đồng bộ ngsw-config.json');
  console.log(`✅ Đã nhúng nội dung release vào appData (${features.length} mục)`);
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
