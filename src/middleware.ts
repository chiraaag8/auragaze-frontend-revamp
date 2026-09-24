import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_LOCKED } from "@/lib/site-lock";

const LOCK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Secure Connection Failed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      height: 100%;
      background: #000;
      color: #6b6b6b;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    main {
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .box { max-width: 420px; }
    .code { color: #8a8a8a; margin-bottom: 14px; letter-spacing: 0.02em; }
    p { margin-bottom: 8px; }
    .ref { margin-top: 18px; color: #444; font-size: 11px; }
  </style>
</head>
<body>
  <main>
    <div class="box">
      <p class="code">ERR_SSL_VERSION_OR_CIPHER_MISMATCH</p>
      <p>This site can’t provide a secure connection.</p>
      <p>The TLS handshake failed during certificate chain validation at the edge terminator. The origin presented an incomplete intermediate chain and renegotiation was aborted.</p>
      <p class="ref">ref · ssl_rx_record_too_long · edge node provisioning</p>
    </div>
  </main>
</body>
</html>`;

export function middleware(request: NextRequest) {
  if (!SITE_LOCKED) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "upstream_tls_failure", code: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH" },
      { status: 503 },
    );
  }

  return new NextResponse(LOCK_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
