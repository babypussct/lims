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

let md = `# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v${packageData.version}

`;

for (const rel of releases) {
  md += `### ${rel.version}\n\n`;

  if (rel.highlights?.length) {
    md += `#### 🚀 Tính năng nổi bật\n\n`;
    rel.highlights.forEach(i => { md += `- ${i}\n`; });
    md += '\n';
  }
  if (rel.features?.length) {
    md += `#### ✨ Tính năng mới\n\n`;
    rel.features.forEach(i => { md += `- ${i}\n`; });
    md += '\n';
  }
  if (rel.improvements?.length) {
    md += `#### ⚡ Tối ưu & cải tiến\n\n`;
    rel.improvements.forEach(i => { md += `- ${i}\n`; });
    md += '\n';
  }
  if (rel.fixes?.length) {
    md += `#### 🐛 Sửa lỗi\n\n`;
    rel.fixes.forEach(i => { md += `- ${i}\n`; });
    md += '\n';
  }
}

fs.writeFileSync('CHANGELOG.md', md);
console.log(`✅ Đã ghi CHANGELOG.md với ${releases.length} phiên bản.`);
