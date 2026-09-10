import assert from "node:assert/strict";
import test from "node:test";

import handler from "../api/contact.js";

process.env.WEB3FORMS_ACCESS_KEY = "test-web3forms-key";
delete process.env.RESEND_API_KEY;
delete process.env.HCAPTCHA_SECRET;

const ORIGIN = "https://daniel.kavangi.co.ke";
const JSON_CT = { "content-type": "application/json" };
const VALID_BODY = {
  name: "Recruiter",
  email: "recruiter@example.com",
  message: "We would like to talk about a role.",
  captcha: `P0_tok_${"x".repeat(40)}`,
};

function mockResponse() {
  const res = { headers: {}, statusCode: null, body: null, ended: false };
  res.setHeader = (key, value) => {
    res.headers[key] = value;
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  res.end = () => {
    res.ended = true;
    return res;
  };
  return res;
}

let ipCounter = 0;

/** Each call gets its own rate-limit bucket unless the test pins one. */
async function call({ method = "POST", headers = {}, body = VALID_BODY, socket = {} } = {}) {
  ipCounter += 1;
  const withIp = { "x-real-ip": `192.0.2.${ipCounter}`, ...headers };
  const res = mockResponse();
  await handler({ method, headers: withIp, body, socket }, res);
  return res;
}

function leaksAccessKey(res) {
  return JSON.stringify(res.body ?? {}).includes("test-web3forms-key");
}

test("rejects requests with no Origin header", async () => {
  const res = await call({ headers: { ...JSON_CT } });
  assert.equal(res.statusCode, 403);
  assert.equal(leaksAccessKey(res), false);
});

test("rejects a foreign Origin", async () => {
  const res = await call({ headers: { ...JSON_CT, origin: "https://evil.example" } });
  assert.equal(res.statusCode, 403);
  assert.equal(leaksAccessKey(res), false);
});

test("rejects plain http from a non-local host", async () => {
  const res = await call({ headers: { ...JSON_CT, origin: "http://daniel.kavangi.co.ke" } });
  assert.equal(res.statusCode, 403);
});

test("allows localhost during development", async () => {
  const res = await call({ headers: { ...JSON_CT, origin: "http://localhost:5173" } });
  assert.equal(res.statusCode, 200);
});

test("requires a captcha token", async () => {
  const res = await call({
    headers: { ...JSON_CT, origin: ORIGIN },
    body: { name: "Bot", email: "bot@example.com", message: "spam" },
  });
  assert.equal(res.statusCode, 400);
  assert.equal(leaksAccessKey(res), false);
});

test("rejects a non-JSON content type", async () => {
  const res = await call({ headers: { origin: ORIGIN, "content-type": "text/plain" } });
  assert.equal(res.statusCode, 415);
});

test("rejects an oversized body", async () => {
  const res = await call({
    headers: { ...JSON_CT, origin: ORIGIN, "content-length": String(64 * 1024) },
  });
  assert.equal(res.statusCode, 413);
});

test("rejects non-POST methods", async () => {
  const res = await call({ method: "GET", headers: { ...JSON_CT, origin: ORIGIN } });
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
});

test("accepts honeypot submissions silently without disclosing the key", async () => {
  const res = await call({
    headers: { ...JSON_CT, origin: ORIGIN },
    body: { ...VALID_BODY, company: "AcmeBot" },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.delivery, "sent");
  assert.equal(leaksAccessKey(res), false);
});

test("rejects a malformed email address", async () => {
  const res = await call({
    headers: { ...JSON_CT, origin: ORIGIN },
    body: { ...VALID_BODY, email: "not-an-email" },
  });
  assert.equal(res.statusCode, 400);
});

test("completes a legitimate browser submission", async () => {
  const res = await call({ headers: { ...JSON_CT, origin: ORIGIN } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.delivery, "handoff");
  assert.equal(res.body.access_key, "test-web3forms-key");
  assert.equal(res.headers.Vary, "Origin");
  assert.equal(res.headers["Cache-Control"], "no-store");
});

test("rate limit is not defeated by spoofing x-forwarded-for", async () => {
  let rejected = 0;
  for (let index = 0; index < 12; index += 1) {
    const res = await call({
      headers: {
        ...JSON_CT,
        origin: ORIGIN,
        "x-real-ip": "198.51.100.7",
        "x-forwarded-for": `10.0.0.${index}`,
      },
    });
    if (res.statusCode === 429) rejected += 1;
  }
  assert.ok(rejected >= 6, `expected the window to close, got ${rejected} rejections`);
});

test("treats a control-character-only name as empty", async () => {
  const res = await call({
    headers: { ...JSON_CT, origin: ORIGIN },
    body: { ...VALID_BODY, name: "\u0000\u0001\u001F" },
  });
  assert.equal(res.statusCode, 400);
});
