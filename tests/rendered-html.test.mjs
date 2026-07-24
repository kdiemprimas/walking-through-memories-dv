import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Walking Through Memories experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="en"/i);
  assert.match(html, /<title>Walking Through Memories by Diem Vo<\/title>/i);
  assert.match(html, /Walking Through Memories/);
  assert.match(html, /Every concert is a chapter\./);
  assert.match(html, /Every memory deserves a place\./);
  assert.match(html, /Begin the walk/);
  assert.match(html, /Memory timeline/);
  assert.match(html, /BAEKHYUN WORLD TOUR &lt;Reverie&gt; IN HANOI/);
  assert.match(html, /The lights fade\. The memory stays\./);
});

test("renders the first real concert chapter with its gallery and media", async () => {
  const html = await (await render()).text();
  const page = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(html, /04 Oct<\/time> · (?:<!-- -->)?Hanoi/);
  assert.match(html, /My Dinh Indoor Athletics Arena/);
  assert.match(html, /Baekhyunee/);
  assert.match(html, /Eri-bong/);
  assert.match(html, /DiemVo here!/);
  assert.match(page, /\/memories\/baekhyun-reverie\/eri-bong\.webp/);
  assert.match(page, /\/memories\/baekhyun-reverie\/diem-vo\.webp/);
  assert.match(page, /\/memories\/baekhyun-reverie\/baekhyunee\.webp/);
  await Promise.all([
    access(new URL("../public/memories/baekhyun-reverie/eri-bong.webp", import.meta.url)),
    access(new URL("../public/memories/baekhyun-reverie/diem-vo.webp", import.meta.url)),
    access(new URL("../public/memories/baekhyun-reverie/baekhyunee.webp", import.meta.url)),
  ]);
  assert.match(html, /https:\/\/www\.youtube-nocookie\.com\/embed\/6k_HJdxqVT4/);
  assert.match(html, /https:\/\/www\.youtube-nocookie\.com\/embed\/ufX7VluncTY/);
  assert.doesNotMatch(html, /\/_vinext\/image\?/);
  assert.match(html, /src="\/memories\/baekhyun-reverie\/eri-bong\.webp"/);
  assert.match(html, /src="\/memories\/baekhyun-reverie\/diem-vo\.webp"/);
  assert.match(html, /src="\/memories\/baekhyun-reverie\/baekhyunee\.webp"/);
  assert.doesNotMatch(html, /Demo chapter|Neon Encore|Lavender Night/);
});

test("renders accessible navigation, filters, chapters, and details", async () => {
  const html = await (await render()).text();

  assert.match(html, /href="#main-content"[^>]*>Skip to memories</i);
  assert.match(html, /<main[^>]*id="main-content"/i);
  assert.match(html, /aria-label="Primary navigation"/i);
  assert.match(html, /aria-label="Filter memories by year"/i);
  assert.match(html, /aria-pressed="true"/i);
  assert.match(html, /<ol[^>]*class="[^"]*timeline-list/i);
  assert.match(html, /<details/i);
  assert.match(html, /<summary/i);
  assert.match(html, /Favorite moment/i);
  assert.match(html, /Before the lights/i);
  assert.match(html, /After the show/i);
});

test("removes the disposable preview and supports reduced motion", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(page, /aria-pressed=\{activeYear === year\}/);
  assert.match(page, /No memories found for this year/);
});

test("uses a rose-afterglow pastel palette without legacy violet accents", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(css, /--blush:\s*#f3afc3/i);
  assert.match(css, /--berry:\s*#bd647f/i);
  assert.match(css, /--rose-gold:\s*#e8ad9f/i);
  assert.doesNotMatch(css, /--lavender|--violet/i);
  assert.doesNotMatch(css, /116,\s*89,\s*220|185,\s*168,\s*255/);
  assert.match(page, /tone:\s*"blush"/);
  assert.doesNotMatch(page, /tone:\s*"violet"/);
});
