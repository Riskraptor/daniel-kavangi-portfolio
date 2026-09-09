import { personalInfo } from "../data/portfolioData";
import { IconDownload } from "./Icons";

export default function ResumeButton({ className = "", variant = "primary", size = "md" }) {
  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-ghost";
  const sizeClass = size === "sm" ? "btn-sm" : "";

  return (
    <a
      href={personalInfo.resumeUrl}
      download={personalInfo.resumeFileName}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
    >
      <IconDownload className="h-4 w-4" />
      Download CV
    </a>
  );
}
