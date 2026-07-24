import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  STUDIO_HOST,
  createStudioServer,
} from "../scripts/memory-studio-server.mjs";
import {
  formatBytes,
  normalizeExternalMediaUrl,
  toYouTubeEmbedUrl,
  validateMediaFile,
} from "../studio/studio-core.mjs";

async function withStudio(run) {
  const server = createStudioServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, STUDIO_HOST, resolve);
  });

  const address = server.address();
  const origin = `http://${STUDIO_HOST}:${address.port}`;

  try {
    await run(origin);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("serves Memory Studio locally with restrictive security headers", async () => {
  await withStudio(async (origin) => {
    const response = await fetch(`${origin}/studio`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
    assert.match(
      response.headers.get("content-security-policy") ?? "",
      /default-src 'self'/,
    );
    assert.match(
      response.headers.get("content-security-policy") ?? "",
      /connect-src 'none'/,
    );
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    assert.match(html, /Memory Studio/);
    assert.match(html, /Bản nháp cục bộ/);
  });
});

test("redirects the local root and refuses unsupported paths and methods", async () => {
  await withStudio(async (origin) => {
    const root = await fetch(`${origin}/`, { redirect: "manual" });
    const head = await fetch(`${origin}/studio/styles.css`, { method: "HEAD" });
    const coreModuleResponse = await fetch(
      `${origin}/studio/studio-core.mjs`,
    );
    const traversal = await fetch(
      `${origin}/studio/%2e%2e/%2e%2e/package.json`,
    );
    const post = await fetch(`${origin}/studio`, { method: "POST" });

    assert.equal(root.status, 302);
    assert.equal(root.headers.get("location"), "/studio");
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    assert.equal(coreModuleResponse.status, 200);
    assert.match(await coreModuleResponse.text(), /validateMediaFile/);
    assert.equal(traversal.status, 404);
    assert.equal(post.status, 405);
  });
});

test("returns a generic error when local studio assets are unavailable", async () => {
  const server = createStudioServer({
    studioRoot: new URL("../missing-studio-assets", import.meta.url).pathname,
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, STUDIO_HOST, resolve);
  });

  const address = server.address();
  const response = await fetch(
    `http://${STUDIO_HOST}:${address.port}/studio`,
  );

  await new Promise((resolve) => server.close(resolve));

  assert.equal(response.status, 500);
  assert.equal(await response.text(), "Memory Studio could not start.");
});

test("validates local image, video, and audio files by type, extension, and size", () => {
  assert.deepEqual(
    validateMediaFile({
      name: "concert.webp",
      type: "image/webp",
      size: 2_000_000,
    }),
    { ok: true, kind: "image" },
  );
  assert.deepEqual(
    validateMediaFile({
      name: "encore.mp4",
      type: "video/mp4",
      size: 25_000_000,
    }),
    { ok: true, kind: "video" },
  );
  assert.deepEqual(
    validateMediaFile({
      name: "voice-note.mp3",
      type: "audio/mpeg",
      size: 4_000_000,
    }),
    { ok: true, kind: "audio" },
  );

  assert.equal(
    validateMediaFile({
      name: "renamed.exe",
      type: "image/jpeg",
      size: 100,
    }).ok,
    false,
  );
  assert.equal(
    validateMediaFile({
      name: "huge.mov",
      type: "video/quicktime",
      size: 251 * 1024 * 1024,
    }).ok,
    false,
  );
  assert.equal(
    validateMediaFile({
      name: "empty.jpg",
      type: "image/jpeg",
      size: 0,
    }).ok,
    false,
  );
  assert.equal(validateMediaFile(null).ok, false);
  assert.equal(
    validateMediaFile({
      name: "unknown",
      type: "image/jpeg",
      size: Number.NaN,
    }).ok,
    false,
  );
});

test("accepts only HTTPS media links and normalizes YouTube embeds", () => {
  assert.equal(
    normalizeExternalMediaUrl(
      "https://media.example.com/encore.mp4",
      "video",
    ),
    "https://media.example.com/encore.mp4",
  );
  assert.throws(
    () => normalizeExternalMediaUrl("http://example.com/song.mp3", "audio"),
    /HTTPS/,
  );
  assert.throws(
    () => normalizeExternalMediaUrl("javascript:alert(1)", "video"),
    /HTTPS/,
  );
  assert.throws(
    () => normalizeExternalMediaUrl("not a url", "video"),
    /không hợp lệ/,
  );
  assert.throws(
    () => normalizeExternalMediaUrl("https://example.com/file", "image"),
    /không hợp lệ/,
  );
  assert.equal(normalizeExternalMediaUrl("  ", "audio"), "");
  assert.equal(
    toYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );
  assert.equal(
    toYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );
  assert.equal(
    toYouTubeEmbedUrl("https://youtube.com/embed/dQw4w9WgXcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );
  assert.equal(
    toYouTubeEmbedUrl("https://youtube.com/shorts/dQw4w9WgXcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );
  assert.equal(
    toYouTubeEmbedUrl("https://example.com/video"),
    null,
  );
  assert.equal(toYouTubeEmbedUrl("not a url"), null);
  assert.equal(toYouTubeEmbedUrl("https://youtu.be/short"), null);
  assert.equal(formatBytes(999), "999 B");
  assert.equal(formatBytes(15_000), "15 KB");
  assert.equal(formatBytes(1_500_000), "1.5 MB");
  assert.equal(formatBytes(15_000_000), "15 MB");
});

test("contains accessible editing, media, preview, and local-draft controls", async () => {
  const [html, script, packageJson, launcher] = await Promise.all([
    readFile(new URL("../studio/index.html", import.meta.url), "utf8"),
    readFile(new URL("../studio/app.js", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../Open Memory Studio.cmd", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<label[^>]*for="title"/i);
  assert.match(html, /id="media-input"[^>]*accept="image\/\*,video\/\*,audio\/\*"/i);
  assert.match(html, /aria-live="polite"/i);
  assert.match(html, /id="live-preview"/i);
  assert.match(html, /Dữ liệu chỉ được lưu trên thiết bị này/i);
  assert.match(script, /indexedDB\.open/);
  assert.match(script, /textContent/);
  assert.doesNotMatch(script, /innerHTML\s*=/);
  assert.doesNotMatch(script, /\bfetch\s*\(/);
  assert.match(packageJson, /"studio":\s*"node scripts\/memory-studio-server\.mjs"/);
  assert.match(launcher, /127\.0\.0\.1:4317\/studio/);
});

test("keeps Memory Studio outside every public application surface", async () => {
  await assert.rejects(access(new URL("../app/studio", import.meta.url)));
  await assert.rejects(access(new URL("../public/studio", import.meta.url)));

  const workflow = await readFile(
    new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
    "utf8",
  );
  assert.match(workflow, /path:\s*\.\/out/);
  assert.doesNotMatch(workflow, /studio/);
});
