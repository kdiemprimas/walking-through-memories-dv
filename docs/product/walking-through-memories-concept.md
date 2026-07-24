# Walking Through Memories by Diem Vo

> **Every concert is a chapter. Every memory deserves a place.**

## 1. Concept cốt lõi

Website là một **cuốn hồi ký concert dạng timeline**, không phải một gallery ảnh thông thường.

Người xem “đi bộ” qua các năm trong hành trình fandom của Diem. Mỗi concert là một **chapter** trên đường thời gian; mỗi tấm vé, bức ảnh, video, setlist hay đoạn nhật ký đều có một vị trí rõ ràng trong chapter đó.

Tên nội bộ cho hướng thiết kế:

**The Afterglow Timeline — Dòng thời gian của những dư âm**

Ba cảm giác chủ đạo:

- **Cinematic:** giống khoảnh khắc sân khấu vừa tắt đèn nhưng ánh sáng vẫn còn lưu lại.
- **Personal:** được kể bằng giọng của Diem, không mang cảm giác của một trang fan-news.
- **Editorial:** mỗi concert được biên tập thành một chương có mở đầu, cao trào và dư âm.

## 2. Lời hứa trải nghiệm

Người xem có thể:

1. Nhìn thấy toàn bộ hành trình concert theo thời gian.
2. Mở một chapter và hiểu câu chuyện của đêm diễn, không chỉ xem ảnh.
3. Tìm lại kỷ niệm theo năm, nghệ sĩ, thành phố hoặc địa điểm.
4. Cảm nhận được cá tính của Diem qua caption, lựa chọn hình ảnh và “favorite moment”.

## 3. Cấu trúc website

### Home — Memory Walk

Trang chủ chính là timeline.

- Hero giới thiệu tên website và slogan.
- Chapter gần nhất xuất hiện như “Latest Memory”.
- Timeline dọc theo năm, từ hiện tại đi ngược về concert đầu tiên.
- Bộ lọc gọn: `Year`, `Artist`, `City`.
- Mỗi chapter card gồm ảnh bìa, ngày, nghệ sĩ, tour, thành phố và một câu ký ức ngắn.

Trên desktop, timeline nằm giữa và các chapter xen kẽ hai bên. Trên mobile, timeline chuyển thành một đường ray bên trái với card xếp dọc để dễ cuộn bằng một tay.

### Chapter — Một concert, một câu chuyện

Mỗi chapter dùng cùng một nhịp kể:

1. **Opening Note** — Vì sao concert này quan trọng.
2. **Before the Lights** — Vé, outfit, hành trình tới venue, người đi cùng.
3. **When the Stage Came Alive** — Ảnh, video, fancam và những khoảnh khắc chính.
4. **The Setlist** — Danh sách bài hát, favorite song và encore.
5. **Keepsakes** — Ticket, wristband, banner, merch, photocard.
6. **After the Show** — Cảm xúc sau concert và điều Diem muốn nhớ lâu nhất.

Cuối chapter có `Previous memory` và `Next memory`, để người xem tiếp tục hành trình mà không phải quay lại trang chủ.

### Gallery

Một mặt phẳng khám phá hình ảnh, nhưng mọi ảnh vẫn dẫn về chapter gốc. Gallery không tách kỷ niệm khỏi câu chuyện.

### Artists

Nhóm các chapter theo nghệ sĩ. Mỗi nghệ sĩ có số concert, thành phố đã gặp và favorite performance.

### About

Giới thiệu ngắn về Diem và lý do tạo archive. Đây cũng là nơi giải thích tinh thần “Every memory deserves a place.”

### Stats — Giai đoạn sau MVP

- Concerts attended
- Artists seen
- Cities and countries
- Most-seen artist
- Favorite encore song
- Years of memories

## 4. Wireframe trang chủ

```text
┌─────────────────────────────────────────────────────────────┐
│ WTM                                        Timeline  About   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              WALKING THROUGH MEMORIES                       │
│                     by Diem Vo                              │
│                                                             │
│     Every concert is a chapter. Every memory deserves       │
│                         a place.                             │
│                                                             │
│                      ↓ Begin the walk                        │
├─────────────────────────────────────────────────────────────┤
│  Latest Memory                                               │
│  [Full-width concert image]                                  │
│  Chapter 12 · Artist · Tour · City · Date                   │
├─────────────────────────────────────────────────────────────┤
│                         2026                                 │
│                           ●──────── [Chapter card]           │
│              [Chapter card] ────────●                       │
│                           │                                 │
│                         2025                                 │
│                           ●──────── [Chapter card]           │
├─────────────────────────────────────────────────────────────┤
│              “The lights fade. The memory stays.”           │
└─────────────────────────────────────────────────────────────┘
```

## 5. Ngôn ngữ hình ảnh

### Bảng màu — Midnight Lavender & Afterglow

| Vai trò | Màu | Mã |
| --- | --- | --- |
| Nền chính | Midnight Ink | `#0B0B12` |
| Bề mặt card | Stage Black | `#151522` |
| Chữ chính | Warm Ivory | `#F5F0E8` |
| Chữ phụ | Haze Gray | `#A9A6B3` |
| Màu thương hiệu | Memory Lavender | `#B7A4FF` |
| Tương tác | Electric Violet | `#7657FF` |
| Điểm nhấn kỷ niệm | Afterglow Gold | `#E9C77B` |

Lavender tạo cảm giác mơ và riêng tư; gold chỉ dùng cho chapter marker, favorite moment và chi tiết “keepsake”, tránh làm giao diện quá xa hoa.

### Typography

- **Display:** `Cormorant Garamond` hoặc `DM Serif Display`.
- **Body/UI:** `Manrope` hoặc `Inter`.
- Chapter number và metadata dùng chữ sans-serif viết hoa, tracking rộng để gợi liên tưởng tới ticket.

### Xử lý ảnh

- Ảnh concert là nhân vật chính, ưu tiên crop rộng và giàu ánh sáng sân khấu.
- Có lớp gradient tối để chữ luôn dễ đọc.
- Grain rất nhẹ và light leak có kiểm soát để tạo cảm giác ký ức.
- Ticket/merch có thể đặt như vật thể scan trên nền giấy tối, không biến toàn site thành scrapbook.

## 6. Chuyển động

Motion phải tạo cảm giác “đang đi qua ký ức”, không phô diễn kỹ thuật.

- Đường timeline được vẽ dần theo vị trí cuộn.
- Chapter marker sáng lên khi đi vào viewport.
- Card xuất hiện bằng fade + dịch chuyển ngắn 12–20 px.
- Hero image có parallax rất nhẹ.
- Khi mở chapter, ảnh bìa mở rộng mượt thành hero của trang chi tiết.
- Không tự phát nhạc hoặc video.
- Tôn trọng `prefers-reduced-motion`; khi bật, tất cả hiệu ứng chuyển thành fade tức thời hoặc bị tắt.

## 7. Mô hình nội dung

```ts
type ConcertChapter = {
  slug: string
  chapterNumber: number
  artist: string
  tour: string
  date: string
  city: string
  country: string
  venue: string
  coverImage: MediaAsset
  openingNote: string
  favoriteSong?: string
  favoriteMoment?: string
  companions?: string[]
  rating?: number
  setlist?: SetlistItem[]
  memories: MemoryBlock[]
  tags: string[]
}

type MediaAsset = {
  type: "photo" | "video" | "ticket" | "merch"
  src: string
  alt: string
  caption?: string
  takenAt?: string
}

type MemoryBlock = {
  section:
    | "before-the-lights"
    | "stage"
    | "setlist"
    | "keepsakes"
    | "after-the-show"
  title?: string
  story?: string
  media: MediaAsset[]
}
```

## 8. MVP đề xuất

### Có trong phiên bản đầu

- Home với Memory Timeline.
- Chapter detail.
- Lọc theo năm và nghệ sĩ.
- Lightbox ảnh có keyboard navigation.
- About.
- Responsive desktop/mobile.
- Metadata và ảnh chia sẻ riêng cho từng chapter.

### Chưa làm trong MVP

- Tài khoản người dùng.
- Admin CMS tùy chỉnh.
- Bình luận hoặc social feed.
- Upload công khai.
- Bản đồ tương tác.
- Dashboard thống kê nâng cao.
- Đồng bộ tự động Spotify/YouTube.

Nội dung nên bắt đầu bằng MDX hoặc dữ liệu tĩnh trong repo. Cách này giữ website nhanh, riêng tư, ít bề mặt tấn công và dễ backup. Chỉ thêm CMS khi số chapter đủ lớn để việc chỉnh file trở thành trở ngại thực tế.

## 9. Stack khuyến nghị

- **Next.js + TypeScript** cho routing, ảnh tối ưu và metadata từng chapter.
- **Tailwind CSS hoặc CSS Modules** cho design tokens và responsive layout.
- **Motion for React** cho timeline và chuyển cảnh có kiểm soát.
- **MDX** cho phần nhật ký giàu cảm xúc.
- **Vitest + React Testing Library** cho component behavior.
- **Playwright** cho timeline, filter, chapter navigation và lightbox.

Đây là hướng khuyến nghị, chưa phải quyết định cố định vì repo hiện chưa có code.

## 10. Accessibility và an toàn nội dung

- Contrast đạt WCAG AA.
- Toàn bộ filter, timeline và lightbox dùng được bằng bàn phím.
- Ảnh có alt text mô tả khoảnh khắc, không chỉ lặp tên file.
- Video có caption hoặc transcript ngắn.
- Không dùng autoplay có âm thanh.
- Không đăng QR/barcode, số ghế đầy đủ hoặc thông tin thanh toán trên vé.
- Xóa metadata vị trí khỏi ảnh trước khi xuất bản.
- Chỉ ghi tên người đi cùng khi có sự đồng ý.
- Có thể đặt chapter ở trạng thái `private` hoặc `unlisted`.
- Ưu tiên ảnh/video do Diem tự chụp; nhạc và video bên thứ ba nên dùng embed chính thức.

## 11. Capability contract

### Capability

Diem có một archive công khai, chỉ đọc, nơi mỗi concert được kể thành một chapter có cấu trúc và được đặt đúng vị trí trên timeline cá nhân.

### Invariants

- Mọi asset phải thuộc về một chapter.
- Mọi chapter phải có ngày, nghệ sĩ, địa điểm, ảnh bìa và opening note.
- Timeline dùng ngày concert làm thứ tự chuẩn.
- Không có nội dung tự phát âm thanh.
- Nội dung riêng tư không được đưa vào build công khai.
- Trải nghiệm cốt lõi phải hoạt động khi tắt motion.

### Actors

- **Diem:** biên tập và xuất bản chapter.
- **Visitor:** duyệt timeline, lọc và đọc chapter.

### States

`draft → private/unlisted → published → archived`

### Handoff

Concept đủ rõ để chuyển sang:

1. Chọn 3–5 concert đại diện để làm seed content.
2. Tạo visual direction và component design system.
3. Viết implementation plan cho MVP.
4. Build timeline trước, sau đó mới mở rộng gallery và stats.

## 12. Các quyết định còn mở

- Timeline mặc định đi từ mới đến cũ hay cũ đến mới.
- Website hoàn toàn public hay có một số chapter private.
- Ảnh lưu trong repo, object storage hay dịch vụ tối ưu media.
- Có cần hai ngôn ngữ Việt–Anh ngay từ MVP hay không.
- Diem muốn người xem tập trung vào câu chuyện cá nhân hay bộ sưu tập ảnh nhiều hơn.
