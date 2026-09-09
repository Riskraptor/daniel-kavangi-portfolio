import { useEffect, useRef, useState } from "react";
import { personalInfo } from "../data/portfolioData";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem("portfolio-intro-seen") === "true";
  } catch {
    return false;
  }
}

function rememberIntro() {
  try {
    window.sessionStorage.setItem("portfolio-intro-seen", "true");
  } catch {
    // The introductory motion remains optional if storage is unavailable.
  }
}

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState("pending");
  const finished = useRef(false);
  const leaving = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    function complete() {
      if (finished.current) return;
      finished.current = true;
      document.body.style.overflow = "";
      setPhase("done");
    }

    function leave() {
      if (finished.current || leaving.current) return;
      leaving.current = true;
      rememberIntro();
      setPhase("leave");
      onDoneRef.current?.();
      window.setTimeout(complete, 550);
    }

    if (prefersReducedMotion() || hasSeenIntro()) {
      onDoneRef.current?.();
      complete();
      return undefined;
    }

    setPhase("play");
    document.body.style.overflow = "hidden";
    const autoLeave = window.setTimeout(leave, 1200);

    return () => {
      window.clearTimeout(autoLeave);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "pending" || phase === "done") return null;

  return (
    <div className={`intro${phase === "leave" ? " is-leave" : ""}`} role="status" aria-label="Loading">
      <span className="intro-grain" aria-hidden="true" />
      <div className="intro-core">
        <p className="intro-mark">{personalInfo.initials}</p>
        <p className="intro-name">{personalInfo.name}</p>
        <span className="intro-line" />
        <p className="intro-role">Data. Risk. Finance. Decisions.</p>
      </div>
    </div>
  );
}
