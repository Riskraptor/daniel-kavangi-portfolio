/**
 * Contact endpoint.
 *
 * Delivery order:
 *   1. Resend, when RESEND_API_KEY is configured.
 *   2. Web3Forms browser hand-off, when WEB3FORMS_ACCESS_KEY is configured.
 *      Free Web3Forms keys must be submitted from the browser, so this route
 *      returns the key only after the request has cleared every check below.
 *
 * Required for either path: an allow-listed Origin and an hCaptcha token.
 * Set HCAPTCHA_SECRET to have the token verified here rather than downstream.
 */

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "danielmwendwa494@gmail.com";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 6;
const MAX_TRACKED_CLIENTS = 5000;
const MAX_BODY_BYTES = 16 * 1024;
const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify";

const ALLOWED_HOSTS = new Set([
  "daniel.kavangi.co.ke",
  "www.daniel.kavangi.co.ke",
  "kavangi.co.ke",
  "www.kavangi.co.ke",
  "kavangi.vercel.app",
]);

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** ip -> number[] of request timestamps inside the current window. */
const hits = new Map();

function clean(value, max) {
  return String(value || "")
    // Strip control characters so headers and mail bodies cannot be forged.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(String(req.body).slice(0, MAX_BODY_BYTES));
  } catch {
    return {};
  }
}

/**
 * Rate-limit key. `x-forwarded-for` is a client-writable header, and taking its
 * first entry lets a caller mint a fresh identity per request. Vercel sets
 * `x-real-ip` itself, so prefer that and fall back to the last (nearest) hop.
 */
function clientIp(req) {
  const realIp = clean(req.headers["x-real-ip"], 64);
  if (realIp) return realIp;

  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (forwarded.length) return forwarded[forwarded.length - 1];

  return req.socket?.remoteAddress || "unknown";
}

/**
 * Browsers send `Origin` on every POST, so a missing header means the caller is
 * not the contact form. Treating it as trusted would leave the route open to
 * any script.
 */
function allowOrigin(origin) {
  if (!origin) return false;
  try {
    const { protocol, hostname } = new URL(origin);
    const local = LOCAL_HOSTS.has(hostname);
    if (protocol !== "https:" && !local) return false;
    if (local) return true;
    if (ALLOWED_HOSTS.has(hostname)) return true;
    // Vercel preview deployments for this project.
    return hostname.startsWith("kavangi-") && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function rateLimit(ip) {
  const now = Date.now();

  // Drop clients whose window has fully expired so the map cannot grow without
  // bound on a warm instance.
  if (hits.size > MAX_TRACKED_CLIENTS) {
    for (const [key, times] of hits) {
      if (!times.some((time) => now - time < WINDOW_MS)) hits.delete(key);
    }
  }

  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

/**
 * Verifies the hCaptcha token when a secret is configured.
 * Returns "ok", "failed", or "unconfigured".
 */
async function verifyCaptcha(token, ip) {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return "unconfigured";

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") params.set("remoteip", ip);

    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!response.ok) return "failed";

    const data = await response.json();
    return data.success === true ? "ok" : "failed";
  } catch {
    return "failed";
  }
}

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Vary", "Origin");
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (!allowOrigin(req.headers.origin)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    res.status(415).json({ error: "Unsupported media type" });
    return;
  }

  if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) {
    res.status(413).json({ error: "Message too large" });
    return;
  }

  const ip = clientIp(req);
  if (!rateLimit(ip)) {
    res.status(429).json({ error: "Too many messages. Try again later." });
    return;
  }

  const body = parseBody(req);
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const message = clean(body.message, 4000);
  const honeypot = clean(body.company, 200);
  const captcha = String(body.captcha || "").trim();

  // Silently accept honeypot submissions so bots cannot tell they were caught.
  if (honeypot) {
    res.status(200).json({ ok: true, delivery: "sent" });
    return;
  }

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Please complete the form." });
    return;
  }

  if (!captcha || captcha.length > 4000) {
    res.status(400).json({ error: "Captcha verification is required." });
    return;
  }

  const captchaResult = await verifyCaptcha(captcha, ip);
  if (captchaResult === "failed") {
    res.status(400).json({ error: "Captcha verification failed. Please try again." });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
  const text = `${message}\n\n- ${name}\n${email}`;
  const subject = `Message from ${name}`.slice(0, 120);

  // Without HCAPTCHA_SECRET nothing here has verified the token, so prefer the
  // Web3Forms hand-off: it validates the token before delivering.
  const canSendDirectly = resendKey && (captchaResult === "ok" || !web3Key);

  if (canSendDirectly) {
    try {
      const sent = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
          to: [TO_EMAIL],
          reply_to: email,
          subject,
          text,
        }),
      });

      if (sent.ok) {
        res.status(200).json({ ok: true, delivery: "sent" });
        return;
      }
    } catch {
      // Fall through to Web3Forms.
    }
  }

  if (web3Key) {
    res.status(200).json({ ok: true, delivery: "handoff", access_key: web3Key });
    return;
  }

  res.status(503).json({ error: "Could not send." });
}
