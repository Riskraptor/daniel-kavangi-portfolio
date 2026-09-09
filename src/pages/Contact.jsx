import { lazy, Suspense, useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  IconArrow,
  IconCheck,
  IconExternal,
  IconGitHub,
  IconLinkedIn,
  IconMail,
  IconPhone,
  IconPin,
  IconSend,
  IconWhatsApp,
} from "../components/Icons";
import { SEND_FAIL, sendMessage, topics, validateMessage } from "../lib/contact";
import { personalInfo, referees, socials } from "../data/portfolioData";

const HCaptcha = lazy(() => import("@hcaptcha/react-hcaptcha"));
const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

const channelIcons = {
  email: IconMail,
  whatsapp: IconWhatsApp,
  linkedin: IconLinkedIn,
  github: IconGitHub,
};

const channels = [
  ...socials.map((item) => ({
    ...item,
    icon: channelIcons[item.id],
  })),
  {
    id: "location",
    label: "Location",
    value: personalInfo.location,
    href: null,
    icon: IconPin,
    external: false,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", other: "", message: "", company: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const captchaRef = useRef(null);
  const sending = status === "loading";

  function resetCaptcha() {
    setCaptcha("");
    captchaRef.current?.resetCaptcha?.();
  }

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (status === "error") {
      setStatus("idle");
      setError("");
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    const problem = validateMessage(form);
    if (problem) {
      setStatus("error");
      setError(problem);
      return;
    }
    if (!captcha) {
      setStatus("error");
      setError("Confirm you are not a robot, then send.");
      document.getElementById("verification")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("loading");
    setError("");
    const started = Date.now();
    const result = await sendMessage({
      name: form.name,
      email: form.email,
      topic: form.topic,
      other: form.other,
      message: form.message,
      company: form.company,
      captcha,
    });
    const wait = Math.max(0, 900 - (Date.now() - started));
    if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait));

    if (!result.ok) {
      setStatus("error");
      setError(SEND_FAIL);
      resetCaptcha();
      return;
    }

    setStatus("sent");
    resetCaptcha();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <PageWrapper>
      <div className="wrap py-14 sm:py-16 lg:py-20">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Actuarial, insurance, banking, data analysis or fintech. Write and I will respond.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            {channels.map((item) => {
              const Icon = item.icon;
              const Cue = item.external ? IconExternal : IconArrow;
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-rule text-accent">
                    {Icon ? <Icon /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block">{item.label}</span>
                    {item.action ? (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                        {item.action}
                        {item.href ? <Cue className="h-3.5 w-3.5 text-accent" /> : null}
                      </span>
                    ) : (
                      <span className="mt-1 block text-sm text-ink">{item.value}</span>
                    )}
                    {item.action && item.value ? (
                      <span className="mt-0.5 block truncate text-sm text-ink-muted">{item.value}</span>
                    ) : null}
                  </span>
                </>
              );
              const className =
                "flex items-center gap-4 bg-surface px-4 py-4 transition-colors hover:border-ink/30";

              if (item.callHref) {
                return (
                  <div key={item.id} className="overflow-hidden border border-rule bg-surface">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${className} border-b border-rule`}
                    >
                      {inner}
                    </a>
                    <a
                      href={item.callHref}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      <span>Call {item.callLabel}</span>
                      <IconArrow className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              }

              return item.href ? (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`border border-rule ${className}`}
                >
                  {inner}
                </a>
              ) : (
                <div key={item.id} className={`border border-rule ${className}`}>
                  {inner}
                </div>
              );
            })}

            <div className="border border-rule bg-surface px-4 py-5">
              <p className="mt-1 text-sm text-ink-muted">{personalInfo.availability}.</p>
              <div className="mt-5">
                <button type="button" onClick={copyEmail} className="btn btn-secondary btn-sm">
                  {copied ? "Email copied" : "Copy email"}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <p className="eyebrow">Referees</p>
              <ul className="mt-3 space-y-3">
                {referees.map((person) => (
                  <li key={person.id} className="border border-rule bg-surface px-4 py-4">
                    <p className="font-medium text-ink">{person.name}</p>
                    <p className="mt-1 text-sm text-ink-soft">{person.title}</p>
                    <p className="text-sm text-ink-muted">{person.organisation}</p>
                    <a
                      href={`mailto:${person.email}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
                    >
                      Write an email
                      <IconExternal className="h-3.5 w-3.5 text-accent" />
                    </a>
                    <p className="mt-0.5 text-sm text-ink-muted">{person.email}</p>
                    <a href={`tel:${person.phone}`} className="mt-2 flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
                      <IconPhone className="h-4 w-4 text-accent" />
                      Call {person.phoneDisplay}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`form-card relative overflow-hidden border border-rule bg-surface p-6 sm:p-8${sending ? " is-sending" : ""}`}>
            {sending ? <div className="send-progress" aria-hidden="true" /> : null}
            {status === "sent" ? (
              <div className="sent-panel flex min-h-[280px] flex-col items-start justify-center">
                <span className="sent-mark" aria-hidden="true">
                  <IconCheck />
                </span>
                <p className="eyebrow mt-5">Thank you</p>
                <h2 className="mt-3 font-serif text-2xl font-medium text-ink">Message received</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  I will get back to you shortly.
                </p>
                <button
                  type="button"
                  className="text-link mt-8 text-sm"
                  onClick={() => {
                    setStatus("idle");
                    setError("");
                    setForm({ name: "", email: "", topic: "", other: "", message: "", company: "" });
                  }}
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className={`space-y-5${sending ? " form-sending" : ""}`}
                noValidate
                aria-busy={sending}
              >
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={onChange}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="eyebrow block">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={onChange}
                    required
                    disabled={sending}
                    className="mt-2 w-full border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus-visible:border-accent disabled:opacity-70"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="eyebrow block">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    inputMode="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    disabled={sending}
                    className="mt-2 w-full border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus-visible:border-accent disabled:opacity-70"
                    placeholder="you@domain.com"
                  />
                </div>
                <div>
                  <label htmlFor="topic" className="eyebrow block">
                    Reason
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={form.topic}
                    onChange={onChange}
                    required
                    disabled={sending}
                    className={`field-select mt-2 w-full border border-rule bg-paper px-4 py-3 text-sm outline-none transition focus-visible:border-accent disabled:opacity-70 ${form.topic ? "text-ink" : "is-empty text-ink-muted/70"}`}
                  >
                    <option value="" disabled hidden>
                      Select one
                    </option>
                    {topics.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                {form.topic === "other" ? (
                  <div>
                    <label htmlFor="other" className="eyebrow block">
                      Subject
                    </label>
                    <input
                      id="other"
                      name="other"
                      maxLength={80}
                      value={form.other}
                      onChange={onChange}
                      required
                      disabled={sending}
                      className="mt-2 w-full border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus-visible:border-accent disabled:opacity-70"
                      placeholder="Short subject"
                    />
                  </div>
                ) : null}
                <div>
                  <label htmlFor="message" className="eyebrow block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    maxLength={4000}
                    value={form.message}
                    onChange={onChange}
                    required
                    disabled={sending}
                    className="mt-2 w-full resize-y border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus-visible:border-accent disabled:opacity-70"
                    placeholder="Role, team, or question"
                  />
                </div>
                <div id="verification" className="captcha-wrap">
                  <p className="eyebrow">Verification</p>
                  <p className="mt-1 mb-3 text-sm text-ink-soft">Confirm you are not a robot.</p>
                  <Suspense fallback={<div className="h-[78px]" aria-hidden="true" />}>
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITEKEY}
                      reCaptchaCompat={false}
                      onVerify={(token) => {
                        setCaptcha(token);
                        if (status === "error") {
                          setStatus("idle");
                          setError("");
                        }
                      }}
                      onExpire={resetCaptcha}
                      onError={resetCaptcha}
                    />
                  </Suspense>
                </div>
                {status === "error" && (
                  <p className="text-sm text-accent" role="alert">
                    {error}
                  </p>
                )}
                <p className="sr-only" role="status" aria-live="polite">
                  {sending ? "Sending your message" : ""}
                </p>
                <button type="submit" className="btn btn-primary btn-send" disabled={sending}>
                  {sending ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <IconSend />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
