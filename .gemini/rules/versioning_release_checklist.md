# Quy tắc release cho Gemini

Nguồn hướng dẫn chuẩn của repository là [.agents/AGENTS.md](../../.agents/AGENTS.md) và [DEPLOYMENT.md](../../DEPLOYMENT.md). Luôn áp dụng hai tài liệu này cho build, release, deploy, commit, push và changelog.

Các nguyên tắc bắt buộc:

- Viết nội dung release mới trong `release-notes.json`.
- Chạy `npm run release:prepare` để pipeline tự đồng bộ version và các artifact phát hành.
- Không sửa trực tiếp `CHANGELOG.md`, `public/release-history.json`, `ngsw-config.json`, `metadata.json` hoặc version trong source.
- Chạy `npm run release:verify` trước commit và `npm run release:prepush` sau commit.
- Frontend production được Vercel Git Integration triển khai từ `main`; không deploy thủ công nếu không có yêu cầu fallback rõ ràng.
