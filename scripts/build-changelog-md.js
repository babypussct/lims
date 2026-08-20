/**
 * build-changelog-md.js
 * Tái tạo CHANGELOG.md từ release-history.json đã đồng bộ cho bản phát hành.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const packageData = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const historyPath = path.join(root, 'public', 'release-history.json');
const legacyPath = path.join(__dirname, 'legacy-releases.json');
const releases = JSON.parse(fs.readFileSync(fs.existsSync(historyPath) ? historyPath : legacyPath, 'utf8'));
const emptyText = '- Không có thay đổi trong nhóm này.\n';

const sections = [
  ['highlights', '🚀 Điểm Nổi Bật Bản Này'],
  ['features', '✨ Tính Năng Mới'],
  ['improvements', '⚡ Cải Tiến & Tối Ưu'],
  ['fixes', '🐛 Sửa Lỗi Hệ Thống']
];

let md = `# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v${packageData.version}

`;

for (const rel of releases) {
  md += `### ${rel.version}\n\n`;

  for (const [key, label] of sections) {
    md += `#### ${label}\n\n`;
    const items = Array.isArray(rel[key]) ? rel[key] : [];
    if (items.length > 0) {
      items.forEach(i => { md += `- ${i}\n`; });
    } else {
      md += emptyText;
    }
    md += '\n';
  }
}

fs.writeFileSync('CHANGELOG.md', md);
console.log(`✅ Đã ghi CHANGELOG.md với ${releases.length} phiên bản.`);
