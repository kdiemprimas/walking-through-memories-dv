import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const STUDIO_HOST = "127.0.0.1";
export const STUDIO_PORT = 4317;

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultStudioRoot = path.resolve(moduleDirectory, "../studio");

const routeFiles = new Map([
  ["/studio", "index.html"],
  ["/studio/", "index.html"],
  ["/studio/styles.css", "styles.css"],
  ["/studio/app.js", "app.js"],
  ["/studio/studio-core.mjs", "studio-core.mjs"],
]);

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
]);

const securityHeaders = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' blob: data:",
    "media-src 'self' blob: data: https:",
    "frame-src https://www.youtube-nocookie.com",
    "connect-src 'none'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    ...securityHeaders,
    ...headers,
  });
  response.end(body);
}

export function createStudioServer({ studioRoot = defaultStudioRoot } = {}) {
  const resolvedRoot = path.resolve(studioRoot);

  return createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      send(response, 405, "Method not allowed", {
        Allow: "GET, HEAD",
        "Content-Type": "text/plain; charset=utf-8",
      });
      return;
    }

    let pathname;
    try {
      pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    } catch {
      send(response, 400, "Bad request", {
        "Content-Type": "text/plain; charset=utf-8",
      });
      return;
    }

    if (pathname === "/") {
      send(response, 302, "", { Location: "/studio" });
      return;
    }

    const fileName = routeFiles.get(pathname);
    if (!fileName) {
      send(response, 404, "Not found", {
        "Content-Type": "text/plain; charset=utf-8",
      });
      return;
    }

    const filePath = path.join(resolvedRoot, fileName);

    try {
      const body = request.method === "HEAD" ? "" : await readFile(filePath);
      send(response, 200, body, {
        "Content-Type": contentTypes.get(path.extname(fileName)),
      });
    } catch {
      send(response, 500, "Memory Studio could not start.", {
        "Content-Type": "text/plain; charset=utf-8",
      });
    }
  });
}

const isMainModule = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  const requestedPort = Number.parseInt(process.env.STUDIO_PORT ?? "", 10);
  const port = Number.isInteger(requestedPort) &&
    requestedPort > 0 &&
    requestedPort <= 65_535
    ? requestedPort
    : STUDIO_PORT;

  const server = createStudioServer();

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Memory Studio is already running on port ${port}.`);
    } else {
      console.error("Memory Studio could not start.");
    }
    process.exitCode = 1;
  });

  server.listen(port, STUDIO_HOST, () => {
    console.log(`Memory Studio: http://${STUDIO_HOST}:${port}/studio`);
    console.log("Close this window or press Ctrl+C to stop the local studio.");
  });
}
