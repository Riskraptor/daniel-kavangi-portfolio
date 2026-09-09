export const config = {
  api: {
    bodyParser: {
      sizeLimit: "16kb",
    },
  },
};

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "danielmwendwa494@gmail.com";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 6;
const hits = new Map();

function clean(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(String(req.body).slice(0, 16000));
  } catch {
    return {};
  }
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

function allowOrigin(origin) {
  if (!origin) return true;
  try {
    const { protocol, hostname } = new URL(origin);
    const local = hostname === "localhost" || hostname === "127.0.0.1";
    if (protocol !== "https:" && !local) return false;
    if (
      hostname === "www.daniel.kavangi.co.ke" ||
      hostname === "daniel.kavangi.co.ke" ||
      hostname === "www.kavangi.co.ke" ||
      hostname === "kavangi.co.ke"
    ) {
      return true;
    }
    if (hostname === "kavangi.vercel.app") return true;
    if (hostname.startsWith("kavangi-") && hostname.endsWith(".vercel.app")) return true;
    if (local) return true;
    return false;
  } catch {
    return false;
  }
}

function rateLimit(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  const origin = req.headers.origin;
  if (!allowOrigin(origin)) {
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

  if (!rateLimit(clientIp(req))) {
    res.status(429).json({ error: "Could not send." });
    return;
  }

  const body = parseBody(req);
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const message = clean(body.message, 4000);
  const honeypot = clean(body.company, 200);

  if (honeypot) {
    res.status(200).json({ ok: true, delivery: "sent" });
    return;
  }

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Please complete the form." });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
  const text = `${message}\n\n- ${name}\n${email}`;
  const subject = `Message from ${name}`.slice(0, 120);

  try {
    if (resendKey) {
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
    }
  } catch {
    // Fall through to Web3Forms.
  }

  // Web3Forms free keys must be used from the browser, not this server.
  if (web3Key) {
    res.status(200).json({ ok: true, delivery: "handoff", access_key: web3Key });
    return;
  }

  res.status(503).json({ error: "Could not send." });
}
