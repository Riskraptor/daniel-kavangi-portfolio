import { useEffect, useRef, useState } from "react";
import { personalInfo } from "../data/portfolioData";

const STORAGE_KEY = "portfolio-intro-seen";
// Short enough that the site feels immediate on a slow connection, long
// enough to register as a deliberate opening rather than a flash.
const HOLD_MS = 600;
const LEAVE_MS = 420;

/**
 * Decided during the first render so the component never has to correct itself
 * in an effect, which would cost an extra render before anything paints.
 */
function shouldSkipIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // The introductory motion stays optional if storage is unavailable.
    return false;
  }
}

function rememberIntro() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Ignored: a missed flag only means the intro plays again next session.
  }
}

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState(() => (shouldSkipIntro() ? "done" : "play"));
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (phase !== "play") {
      onDoneRef.current?.();
      return undefined;
    }

    rememberIntro();
    document.body.style.overflow = "hidden";

    const toLeave = window.setTimeout(() => {
      setPhase("leave");
      onDoneRef.current?.();
    }, HOLD_MS);

    return () => {
      window.clearTimeout(toLeave);
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "leave") return undefined;
    const toDone = window.setTimeout(() => setPhase("done"), LEAVE_MS);
    return () => window.clearTimeout(toDone);
  }, [phase]);

  if (phase === "done") return null;

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
