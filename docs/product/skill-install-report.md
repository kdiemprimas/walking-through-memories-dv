# Skill Install Report

## Stack evidence

- Workspace hiện là Git repo trống, chưa có source code hoặc dependency manifest.
- Brief sản phẩm là một website Memory Timeline giàu hình ảnh và chuyển động.
- Next.js/React là stack đề xuất trong concept, chưa phải stack đã được xác nhận bởi code.

## DAILY

Các skill đã có và phù hợp với hầu hết phiên làm việc của dự án:

- `product-capability` — chuyển brief thành capability contract.
- `frontend-patterns` — nền tảng React/Next.js.
- `coding-standards` — quy ước chất lượng code.
- `security-review` — bảo vệ input, media, secret và API.
- `e2e-testing` — kiểm thử luồng timeline/chapter.
- `verification-loop` — xác minh trước khi bàn giao.

Các skill mới cài:

- `accessibility`
- `design-system`
- `frontend-design-direction`
- `product-lens`

## LIBRARY

Đã cài để dùng khi stack React/Next.js được chốt:

- `react-patterns`
- `react-performance`
- `react-testing`
- `motion-foundations`
- `motion-patterns`
- `seo`

Đã cài từ Superpowers cho giai đoạn review:

- `requesting-code-review`
- `receiving-code-review`
- `verification-before-completion`

## Excluded

- `brainstorming` — có local server, telemetry logic, shell scripts và đường dẫn thực thi lệnh qua biến môi trường; không cần thiết cho dự án.
- `systematic-debugging` — có ví dụ kiểm tra biến môi trường dễ bị sử dụng sai và làm lộ giá trị.
- `using-superpowers` — bootstrap can thiệp mọi hội thoại và tăng context mặc định.
- `test-driven-development` — trùng mạnh với `tdd-workflow` đã có.
- `dispatching-parallel-agents` và `subagent-driven-development` — chưa cần cho repo trống.
- Các skill backend, framework khác, hooks, MCP config, model config và agent tự trị — không có bằng chứng repo cần dùng.

## Verification

- Nguồn ECC: `affaan-m/ecc`.
- Nguồn Superpowers được xác minh: `obra/superpowers`.
- Skill được cài bằng helper chuẩn của Codex Skill Installer.
- Chỉ cài các thư mục skill đã chọn; không cài hooks, MCP, model config hoặc plugin bootstrap.
- Các skill mới sẽ được Codex nhận diện từ lượt làm việc tiếp theo.
