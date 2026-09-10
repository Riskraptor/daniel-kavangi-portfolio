import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSubject,
  firstInvalidField,
  validateMessage,
} from "../src/lib/contact.js";

const VALID = {
  name: "Amina Yusuf",
  email: "amina@example.com",
  topic: "hiring",
  other: "",
  message: "We have an actuarial analyst opening.",
};

test("a complete form produces no errors", () => {
  assert.deepEqual(validateMessage(VALID), {});
});

test("flags each missing field independently", () => {
  const errors = validateMessage({ name: "", email: "", topic: "", other: "", message: "" });
  assert.deepEqual(Object.keys(errors).sort(), ["email", "message", "name", "topic"]);
});

test("distinguishes a missing email from a malformed one", () => {
  assert.equal(validateMessage({ ...VALID, email: "" }).email, "Add your email address.");
  assert.equal(
    validateMessage({ ...VALID, email: "amina.example.com" }).email,
    "That email address does not look right."
  );
});

test("treats whitespace-only input as missing", () => {
  const errors = validateMessage({ ...VALID, name: "   ", message: "\t\n " });
  assert.equal(errors.name, "Add your name.");
  assert.equal(errors.message, "Add a message.");
});

test("rejects a topic that is not on the list", () => {
  assert.equal(validateMessage({ ...VALID, topic: "spam" }).topic, "Choose one of the listed reasons.");
});

test("requires a subject only when the topic is 'other'", () => {
  assert.equal(validateMessage({ ...VALID, topic: "other", other: "" }).other, "Add a short subject.");
  assert.deepEqual(validateMessage({ ...VALID, topic: "other", other: "Speaking invite" }), {});
});

test("firstInvalidField follows visual field order", () => {
  assert.equal(firstInvalidField({ message: "x", name: "x" }), "name");
  assert.equal(firstInvalidField({ message: "x", topic: "x" }), "topic");
  assert.equal(firstInvalidField({ captcha: "x" }), "captcha");
  assert.equal(firstInvalidField({}), null);
});

test("buildSubject reflects the chosen topic", () => {
  assert.equal(buildSubject("hiring", "", "Amina Yusuf"), "Hiring from Amina Yusuf");
  assert.equal(buildSubject("other", "Speaking invite", "Amina Yusuf"), "Speaking invite from Amina Yusuf");
  assert.equal(buildSubject("", "", "Amina Yusuf"), "");
});

test("buildSubject strips control characters from a supplied subject", () => {
  const subject = buildSubject("other", "Subject\u0000\u001FLine", "Amina Yusuf");
  // eslint-disable-next-line no-control-regex -- asserting they are gone
  assert.ok(!/[\u0000-\u001F]/.test(subject), "control characters must not survive");
});
