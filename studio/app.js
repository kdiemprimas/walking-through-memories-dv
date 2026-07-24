import {
  formatBytes,
  normalizeExternalMediaUrl,
  toYouTubeEmbedUrl,
  validateMediaFile,
} from "/studio/studio-core.mjs";

const DATABASE_NAME = "walking-through-memories-studio";
const DATABASE_VERSION = 1;
const DRAFT_KEY = "current";
const FORM_FIELDS = [
  "chapter",
  "year",
  "date",
  "city",
  "venue",
  "title",
  "subtitle",
  "note",
  "before",
  "favorite",
  "after",
  "external-video",
  "external-audio",
];

const elements = {};
const objectUrls = new Map();
let database;
let mediaItems = [];
let autosaveTimer;
let statusTimer;

document.addEventListener("DOMContentLoaded", () => {
  void initializeStudio();
});

async function initializeStudio() {
  cacheElements();
  bindEvents();

  try {
    database = await openDatabase();
    await restoreDraft();
    mediaItems = await getAllRecords("media");
    mediaItems.sort((a, b) => a.order - b.order);
    renderMediaList();
    updatePreview();
    setLastSaved();
    showStatus("Bản nháp cục bộ đã sẵn sàng.");
  } catch {
    showStatus(
      "Không thể mở kho lưu trữ cục bộ. Hãy kiểm tra quyền lưu dữ liệu của trình duyệt.",
      true,
    );
  }
}

function cacheElements() {
  elements.form = document.querySelector("#draft-form");
  elements.mediaInput = document.querySelector("#media-input");
  elements.dropZone = document.querySelector("#media-drop-zone");
  elements.mediaList = document.querySelector("#media-list");
  elements.previewMedia = document.querySelector("#preview-media");
  elements.status = document.querySelector("#studio-status");
  elements.lastSaved = document.querySelector("#last-saved");
  elements.saveButton = document.querySelector("#save-draft");
  elements.exportButton = document.querySelector("#export-draft");
  elements.resetButton = document.querySelector("#reset-draft");
  elements.ready = document.querySelector("#ready");
  elements.previewState = document.querySelector("#preview-state");

  for (const field of FORM_FIELDS) {
    elements[field] = document.querySelector(`#${field}`);
  }
}

function bindEvents() {
  elements.form.addEventListener("input", () => {
    updatePreview();
    scheduleAutosave();
  });

  elements.form.addEventListener("change", () => {
    updatePreview();
    scheduleAutosave();
  });

  elements.saveButton.addEventListener("click", () => {
    void saveDraft({ announce: true });
  });

  elements.exportButton.addEventListener("click", () => {
    void exportDraft();
  });

  elements.resetButton.addEventListener("click", () => {
    void resetDraft();
  });

  elements.mediaInput.addEventListener("change", (event) => {
    void addMediaFiles(event.target.files);
    event.target.value = "";
  });

  for (const eventName of ["dragenter", "dragover"]) {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.add("is-dragging");
    });
  }

  for (const eventName of ["dragleave", "drop"]) {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.remove("is-dragging");
    });
  }

  elements.dropZone.addEventListener("drop", (event) => {
    void addMediaFiles(event.dataTransfer.files);
  });

  window.addEventListener("beforeunload", revokeObjectUrls);
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const nextDatabase = request.result;

      if (!nextDatabase.objectStoreNames.contains("drafts")) {
        nextDatabase.createObjectStore("drafts", { keyPath: "id" });
      }

      if (!nextDatabase.objectStoreNames.contains("media")) {
        nextDatabase.createObjectStore("media", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Database is blocked."));
  });
}

function getRecord(storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllRecords(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function putRecord(storeName, value) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function deleteRecord(storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(key);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function clearStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).clear();
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

async function restoreDraft() {
  const record = await getRecord("drafts", DRAFT_KEY);
  if (!record?.content) {
    return;
  }

  for (const field of FORM_FIELDS) {
    const element = elements[field];
    if (element && typeof record.content[field] === "string") {
      element.value = record.content[field];
    }
  }

  elements.ready.checked = Boolean(record.content.ready);
}

function collectDraftContent() {
  const content = {};

  for (const field of FORM_FIELDS) {
    content[field] = elements[field].value;
  }

  content.ready = elements.ready.checked;
  return content;
}

function validateExternalInputs({ announce = false } = {}) {
  const pairs = [
    [elements["external-video"], "video"],
    [elements["external-audio"], "audio"],
  ];
  let isValid = true;

  for (const [input, kind] of pairs) {
    try {
      normalizeExternalMediaUrl(input.value, kind);
      input.setCustomValidity("");
    } catch (error) {
      input.setCustomValidity(error.message);
      isValid = false;
    }
  }

  if (!elements.title.value.trim()) {
    elements.title.setCustomValidity("Hãy thêm tên cho ký ức.");
    isValid = false;
  } else {
    elements.title.setCustomValidity("");
  }

  if (announce && !isValid) {
    elements.form.reportValidity();
    showStatus("Hãy sửa các trường chưa hợp lệ trước khi lưu.", true);
  }

  return isValid;
}

async function saveDraft({ announce = false } = {}) {
  if (!database || !validateExternalInputs({ announce })) {
    return false;
  }

  const savedAt = new Date().toISOString();

  try {
    await putRecord("drafts", {
      id: DRAFT_KEY,
      content: collectDraftContent(),
      savedAt,
    });
    setLastSaved(savedAt);

    if (announce) {
      showStatus("Đã lưu bản nháp trên thiết bị này.");
    }

    return true;
  } catch {
    showStatus("Không thể lưu bản nháp. Dung lượng trình duyệt có thể đã đầy.", true);
    return false;
  }
}

function scheduleAutosave() {
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => {
    void saveDraft();
  }, 500);
}

async function addMediaFiles(fileList) {
  if (!database || !fileList?.length) {
    return;
  }

  const errors = [];
  let added = 0;

  for (const file of Array.from(fileList)) {
    const validation = validateMediaFile(file);
    if (!validation.ok) {
      errors.push(validation.error);
      continue;
    }

    const record = {
      id: globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind: validation.kind,
      name: file.name,
      type: file.type,
      size: file.size,
      caption: "",
      order: mediaItems.length + added,
      createdAt: new Date().toISOString(),
      blob: file,
    };

    try {
      await putRecord("media", record);
      mediaItems.push(record);
      added += 1;
    } catch {
      errors.push(`${file.name}: không đủ dung lượng lưu trữ cục bộ.`);
    }
  }

  renderMediaList();
  updatePreview();

  if (errors.length) {
    showStatus(errors.join(" "), true);
  } else if (added > 0) {
    showStatus(`Đã thêm ${added} media vào bản nháp.`);
  }
}

function getObjectUrl(record) {
  if (!objectUrls.has(record.id)) {
    objectUrls.set(record.id, URL.createObjectURL(record.blob));
  }
  return objectUrls.get(record.id);
}

function revokeObjectUrls() {
  for (const url of objectUrls.values()) {
    URL.revokeObjectURL(url);
  }
  objectUrls.clear();
}

function renderMediaList() {
  const fragment = document.createDocumentFragment();

  if (!mediaItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty-media";
    empty.textContent = "Chưa có media trong bản nháp.";
    fragment.append(empty);
    elements.mediaList.replaceChildren(fragment);
    return;
  }

  mediaItems.forEach((record, index) => {
    const item = document.createElement("article");
    item.className = "media-item";
    item.setAttribute("role", "listitem");

    const thumb = document.createElement("div");
    thumb.className = "media-thumb";
    thumb.append(createMediaElement(record, { compact: true }));

    const info = document.createElement("div");
    info.className = "media-info";

    const name = document.createElement("strong");
    name.textContent = record.name;

    const details = document.createElement("small");
    details.textContent = `${mediaLabel(record.kind)} · ${formatBytes(record.size)}`;

    const captionId = `caption-${record.id}`;
    const captionLabel = document.createElement("label");
    captionLabel.className = "visually-hidden";
    captionLabel.htmlFor = captionId;
    captionLabel.textContent = `Chú thích cho ${record.name}`;

    const caption = document.createElement("input");
    caption.id = captionId;
    caption.className = "caption-input";
    caption.maxLength = 140;
    caption.placeholder = "Thêm chú thích…";
    caption.value = record.caption;
    caption.addEventListener("change", () => {
      record.caption = caption.value;
      void putRecord("media", record);
      updatePreview();
    });

    info.append(name, details, captionLabel, caption);

    const actions = document.createElement("div");
    actions.className = "media-actions";
    actions.append(
      createIconButton("↑", `Đưa ${record.name} lên trước`, () => {
        void moveMedia(index, -1);
      }, index === 0),
      createIconButton("↓", `Đưa ${record.name} xuống sau`, () => {
        void moveMedia(index, 1);
      }, index === mediaItems.length - 1),
      createIconButton("×", `Xóa ${record.name}`, () => {
        void removeMedia(record);
      }),
    );

    item.append(thumb, info, actions);
    fragment.append(item);
  });

  elements.mediaList.replaceChildren(fragment);
}

function createIconButton(text, label, action, disabled = false) {
  const button = document.createElement("button");
  button.className = "icon-button";
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", label);
  button.disabled = disabled;
  button.addEventListener("click", action);
  return button;
}

function createMediaElement(record, { compact = false } = {}) {
  const source = getObjectUrl(record);
  let element;

  if (record.kind === "image") {
    element = document.createElement("img");
    element.src = source;
    element.alt = record.caption || record.name;
  } else if (record.kind === "video") {
    element = document.createElement("video");
    element.src = source;
    element.controls = !compact;
    element.muted = compact;
    element.preload = "metadata";
  } else {
    element = document.createElement("audio");
    element.src = source;
    element.controls = true;
    element.preload = "metadata";
  }

  return element;
}

async function moveMedia(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= mediaItems.length) {
    return;
  }

  [mediaItems[index], mediaItems[targetIndex]] = [
    mediaItems[targetIndex],
    mediaItems[index],
  ];

  mediaItems.forEach((record, order) => {
    record.order = order;
  });

  try {
    await Promise.all(
      [mediaItems[index], mediaItems[targetIndex]].map((record) => (
        putRecord("media", record)
      )),
    );
    renderMediaList();
    updatePreview();
  } catch {
    showStatus("Không thể thay đổi thứ tự media.", true);
  }
}

async function removeMedia(record) {
  const confirmed = window.confirm(`Xóa “${record.name}” khỏi bản nháp?`);
  if (!confirmed) {
    return;
  }

  try {
    await deleteRecord("media", record.id);
    mediaItems = mediaItems.filter((item) => item.id !== record.id);
    const objectUrl = objectUrls.get(record.id);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrls.delete(record.id);
    }
    mediaItems.forEach((item, order) => {
      item.order = order;
    });
    await Promise.all(mediaItems.map((item) => putRecord("media", item)));
    renderMediaList();
    updatePreview();
    showStatus("Đã xóa media khỏi bản nháp.");
  } catch {
    showStatus("Không thể xóa media.", true);
  }
}

function updatePreview() {
  const date = formatConcertDate(elements.date.value);
  const city = elements.city.value.trim() || "Thành phố";
  const meta = [date, city].filter(Boolean).join(" · ");

  setText("preview-chapter", elements.chapter.value.trim() || "05");
  setText("preview-meta", meta);
  setText(
    "preview-memory-title",
    elements.title.value.trim() || "Untitled memory",
  );
  setText(
    "preview-subtitle",
    elements.subtitle.value.trim() || "Add a line that brings the night back.",
  );
  setText(
    "preview-note",
    `“${elements.note.value.trim() || "Your opening memory will appear here."}”`,
  );
  setText(
    "preview-before",
    elements.before.value.trim() || "Add the moments before the show.",
  );
  setText(
    "preview-favorite",
    elements.favorite.value.trim() || "Keep the best second of the night.",
  );
  setText(
    "preview-after",
    elements.after.value.trim() || "Write what stayed with you.",
  );
  setText(
    "preview-venue",
    elements.venue.value.trim() || "Venue chưa được thêm",
  );

  elements.previewState.textContent = elements.ready.checked
    ? "Ready to review"
    : "Draft";

  renderPreviewMedia();
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function formatConcertDate(value) {
  if (!value) {
    return "Ngày";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Ngày";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function renderPreviewMedia() {
  const fragment = document.createDocumentFragment();

  for (const record of mediaItems.slice(0, 3)) {
    const figure = document.createElement("figure");
    figure.append(createMediaElement(record));

    if (record.caption || record.name) {
      const caption = document.createElement("figcaption");
      caption.textContent = record.caption || record.name;
      figure.append(caption);
    }

    fragment.append(figure);
  }

  appendExternalVideo(fragment);
  appendExternalAudio(fragment);
  elements.previewMedia.replaceChildren(fragment);
}

function appendExternalVideo(fragment) {
  let url;
  try {
    url = normalizeExternalMediaUrl(elements["external-video"].value, "video");
  } catch {
    return;
  }

  if (!url) {
    return;
  }

  const embedUrl = toYouTubeEmbedUrl(url);

  if (embedUrl) {
    const frame = document.createElement("iframe");
    frame.src = embedUrl;
    frame.title = "Video concert trong bản nháp";
    frame.loading = "lazy";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    fragment.append(frame);
    return;
  }

  const figure = document.createElement("figure");
  const video = document.createElement("video");
  video.src = url;
  video.controls = true;
  video.preload = "metadata";
  figure.append(video);
  fragment.append(figure);
}

function appendExternalAudio(fragment) {
  let url;
  try {
    url = normalizeExternalMediaUrl(elements["external-audio"].value, "audio");
  } catch {
    return;
  }

  if (!url) {
    return;
  }

  const figure = document.createElement("figure");
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  audio.preload = "metadata";
  figure.append(audio);
  fragment.append(figure);
}

async function exportDraft() {
  const saved = await saveDraft({ announce: true });
  if (!saved) {
    return;
  }

  const manifest = {
    schema: "walking-through-memories/draft-v1",
    exportedAt: new Date().toISOString(),
    note: "Media files remain in this browser and are listed below by name.",
    content: collectDraftContent(),
    media: mediaItems.map(({ id, kind, name, type, size, caption, order }) => ({
      id,
      kind,
      name,
      type,
      size,
      caption,
      order,
    })),
  };

  const blob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${draftFileName()}-draft.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  showStatus("Đã xuất nội dung bản nháp. Media vẫn được giữ trên thiết bị này.");
}

function draftFileName() {
  const base = [
    elements.year.value.trim(),
    elements.title.value.trim(),
  ].filter(Boolean).join("-");

  return (base || "concert-memory")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function resetDraft() {
  const confirmed = window.confirm(
    "Xóa toàn bộ nội dung và media đang lưu trên máy? Thao tác này không thể hoàn tác.",
  );

  if (!confirmed) {
    return;
  }

  try {
    await Promise.all([
      clearStore("drafts"),
      clearStore("media"),
    ]);
    revokeObjectUrls();
    mediaItems = [];
    elements.form.reset();
    renderMediaList();
    updatePreview();
    setLastSaved();
    elements.title.focus();
    showStatus("Đã xóa toàn bộ bản nháp trên thiết bị này.");
  } catch {
    showStatus("Không thể xóa bản nháp.", true);
  }
}

function setLastSaved(value) {
  if (!value) {
    elements.lastSaved.textContent = "Chưa lưu";
    return;
  }

  const date = new Date(value);
  elements.lastSaved.textContent = `Lưu lần cuối ${new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)}`;
}

function showStatus(message, isError = false) {
  window.clearTimeout(statusTimer);
  elements.status.textContent = message;
  elements.status.classList.toggle("is-error", isError);
  elements.status.classList.add("is-visible");

  statusTimer = window.setTimeout(() => {
    elements.status.classList.remove("is-visible");
  }, 4_500);
}

function mediaLabel(kind) {
  if (kind === "image") {
    return "Ảnh";
  }
  if (kind === "video") {
    return "Video";
  }
  return "Âm thanh";
}
