import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds a static export with the GitHub repository base path", async () => {
  const config = await readFile(
    new URL("../next.config.ts", import.meta.url),
    "utf8",
  );

  assert.match(config, /GITHUB_ACTIONS/);
  assert.match(config, /GITHUB_REPOSITORY/);
  assert.match(config, /output:\s*isGitHubPages\s*\?\s*"export"/);
  assert.match(config, /basePath/);
  assert.match(config, /NEXT_PUBLIC_BASE_PATH:\s*basePath/);
  assert.match(config, /unoptimized:\s*true/);
  assert.match(config, /tsconfigPath/);
});

test("type-checks only the static website surface for GitHub Pages", async () => {
  const config = await readFile(
    new URL("../tsconfig.pages.json", import.meta.url),
    "utf8",
  );

  assert.match(config, /"extends":\s*"\.\/tsconfig\.json"/);
  assert.match(config, /"app\/\*\*\/\*\.ts"/);
  assert.match(config, /"app\/\*\*\/\*\.tsx"/);
  assert.doesNotMatch(config, /"db\/\*\*/);
  assert.doesNotMatch(config, /"worker\/\*\*/);
});

test("publishes the static export through GitHub Pages", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npx next build/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});
