const MEDIA_RULES = {
  image: {
    maxBytes: 15 * 1024 * 1024,
    types: new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]),
    extensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]),
  },
  video: {
    maxBytes: 250 * 1024 * 1024,
    types: new Set(["video/mp4", "video/webm", "video/quicktime"]),
    extensions: new Set([".mp4", ".webm", ".mov"]),
  },
  audio: {
    maxBytes: 30 * 1024 * 1024,
    types: new Set(["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav"]),
    extensions: new Set([".mp3", ".m4a", ".ogg", ".wav"]),
  },
};

function extensionOf(name) {
  const match = name.toLowerCase().match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

export function validateMediaFile(file) {
  if (!file || typeof file.name !== "string") {
    return { ok: false, error: "Không đọc được tệp đã chọn." };
  }

  if (!Number.isFinite(file.size) || file.size <= 0) {
    return { ok: false, error: `${file.name}: tệp trống hoặc không hợp lệ.` };
  }

  const extension = extensionOf(file.name);
  const entry = Object.entries(MEDIA_RULES).find(([, rule]) => (
    rule.types.has(file.type) && rule.extensions.has(extension)
  ));

  if (!entry) {
    return {
      ok: false,
      error: `${file.name}: định dạng tệp chưa được hỗ trợ.`,
    };
  }

  const [kind, rule] = entry;

  if (file.size > rule.maxBytes) {
    return {
      ok: false,
      error: `${file.name}: vượt giới hạn ${formatBytes(rule.maxBytes)}.`,
    };
  }

  return { ok: true, kind };
}

export function normalizeExternalMediaUrl(value, kind) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (kind !== "video" && kind !== "audio") {
    throw new Error("Loại media không hợp lệ.");
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Đường dẫn media không hợp lệ.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Chỉ chấp nhận đường dẫn HTTPS.");
  }

  return url.href;
}

export function toYouTubeEmbedUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  let videoId = null;

  if (url.hostname === "youtu.be") {
    videoId = url.pathname.slice(1).split("/")[0];
  } else if (
    url.hostname === "www.youtube.com" ||
    url.hostname === "youtube.com"
  ) {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else if (url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/")[2];
    } else if (url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/")[2];
    }
  }

  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function formatBytes(bytes) {
  if (bytes < 1_000) {
    return `${bytes} B`;
  }

  if (bytes < 1_000_000) {
    return `${Math.round(bytes / 1_000)} KB`;
  }

  const megabytes = bytes / 1_000_000;
  const digits = megabytes >= 10 ? 0 : 1;
  return `${megabytes.toFixed(digits)} MB`;
}

export const studioLimits = Object.freeze({
  image: MEDIA_RULES.image.maxBytes,
  video: MEDIA_RULES.video.maxBytes,
  audio: MEDIA_RULES.audio.maxBytes,
});
