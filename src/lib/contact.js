export const SEND_FAIL =
  "Could not send right now. Check your connection and try again in a few minutes.";

export const topics = [
  { id: "hiring", label: "Hiring" },
  { id: "consulting", label: "Consulting" },
  { id: "collaboration", label: "Collaboration" },
  { id: "question", label: "Question" },
  { id: "other", label: "Other" },
];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value, max) {
  return String(value || "")
    // Strip control characters so headers and mail bodies cannot be forged.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function topicLabel(topic, other) {
  const match = topics.find((item) => item.id === topic);
  if (!match) return "";
  if (match.id === "other") return clean(other, 80);
  return match.label;
}

export function buildSubject(topic, other, name) {
  const label = topicLabel(topic, other);
  const who = clean(name, 100);
  if (!label || !who) return "";
  return `${label} from ${who}`.slice(0, 120);
}

/**
 * Returns a field -> message map, empty when the form is ready to send.
 * Per-field messages let the form mark the specific control that needs
 * attention instead of showing one sentence covering four possible causes.
 */
export function validateMessage({ name, email, message, topic, other }) {
  const errors = {};

  if (!clean(name, 100)) {
    errors.name = "Add your name.";
  }

  const nextEmail = clean(email, 254);
  if (!nextEmail) {
    errors.email = "Add your email address.";
  } else if (!isValidEmail(nextEmail)) {
    errors.email = "That email address does not look right.";
  }

  if (!topic) {
    errors.topic = "Choose why you are writing.";
  } else if (!topics.some((item) => item.id === topic)) {
    errors.topic = "Choose one of the listed reasons.";
  } else if (topic === "other" && !clean(other, 80)) {
    errors.other = "Add a short subject.";
  }

  if (!clean(message, 4000)) {
    errors.message = "Add a message.";
  }

  return errors;
}

/** Field order used to decide which invalid control receives focus. */
export const fieldOrder = ["name", "email", "topic", "other", "message", "captcha"];

export function firstInvalidField(errors) {
  return fieldOrder.find((field) => errors[field]) || null;
}

async function deliverViaWeb3Forms({ name, email, message, topic, subject, accessKey, captcha }) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject,
      from_name: name,
      replyto: email,
      name,
      email,
      topic,
      message,
      website: "https://daniel.kavangi.co.ke/contact",
      botcheck: "",
      "h-captcha-response": captcha,
    }),
  });
  const data = await response.json().catch(() => ({}));
  return Boolean(response.ok && data.success === true);
}

export async function sendMessage(payload) {
  const safe = {
    name: clean(payload.name, 100),
    email: clean(payload.email, 254),
    message: clean(payload.message, 4000),
    company: clean(payload.company, 200),
    topicId: String(payload.topic || ""),
    other: clean(payload.other, 80),
    captcha: String(payload.captcha || "").trim(),
  };
  const topic = topicLabel(safe.topicId, safe.other);
  const subject = buildSubject(safe.topicId, safe.other, safe.name);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: safe.name,
        email: safe.email,
        message: safe.message,
        company: safe.company,
        captcha: safe.captcha,
      }),
    });

    if (!response.ok) {
      return { ok: false, delivery: "error" };
    }

    const data = await response.json();
    if (data.delivery === "sent") {
      return { ok: true, delivery: "sent" };
    }

    if (data.delivery === "handoff" && data.access_key) {
      const delivered = await deliverViaWeb3Forms({
        name: safe.name,
        email: safe.email,
        message: safe.message,
        topic,
        subject,
        accessKey: data.access_key,
        captcha: safe.captcha,
      });
      if (delivered) {
        return { ok: true, delivery: "sent" };
      }
    }

    return { ok: false, delivery: "error" };
  } catch {
    return { ok: false, delivery: "error" };
  }
}
