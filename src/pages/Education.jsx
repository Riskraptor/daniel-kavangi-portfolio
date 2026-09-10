import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import Tabs from "../components/Tabs";
import { IconExternal } from "../components/Icons";
import { certifications, education, refereeNote, referees } from "../data/portfolioData";

function StudiesPanel() {
  const degree = education[0];

  return (
    <article className="panel p-6 sm:p-8">
      <p className="eyebrow">{degree.credential}</p>
      <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink">{degree.degree}</h3>
      <p className="mt-3 text-lg text-ink-soft">{degree.institution}</p>
      <p className="mt-1 text-sm text-ink-muted">{degree.period}</p>
      {degree.status ? <p className="mt-3 text-sm font-medium text-accent">{degree.status}</p> : null}
      {degree.href && (
        <a
          href={degree.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          University website
          <IconExternal />
        </a>
      )}
    </article>
  );
}

function RefereesPanel() {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {referees.map((person) => (
          <li key={person.id} className="panel p-5">
            <p className="eyebrow">{person.organisation}</p>
            <h3 className="mt-2 font-serif text-xl font-medium tracking-tight text-ink">{person.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">{person.title}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-muted">{refereeNote}</p>
    </div>
  );
}

function CertificatesPanel() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {certifications.map((cert) => (
        <li key={cert.id} className="panel flex flex-col justify-between p-5">
          <div>
            <p className="text-sm text-ink-muted">
              {cert.issuer} · {cert.year}
            </p>
            <h3 className="mt-2 font-medium leading-snug text-ink">{cert.title}</h3>
          </div>
          <a
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link mt-5 inline-flex items-center gap-1.5 text-sm"
          >
            View certificate
            <IconExternal />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Education() {
  const [tab, setTab] = useState("studies");

  const tabs = [
    { id: "studies", label: "Degree", content: <StudiesPanel /> },
    { id: "certificates", label: "Certificates", content: <CertificatesPanel /> },
    { id: "referees", label: "Referees", content: <RefereesPanel /> },
  ];

  return (
    <PageWrapper>
      <div className="wrap py-14 sm:py-16 lg:py-20">
        <p className="eyebrow">Education</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Education
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Bachelor of Science in Actuarial Science and selected certificates.
        </p>
        <div className="mt-10">
          <Tabs tabs={tabs} value={tab} onChange={setTab} label="Education sections" />
        </div>
      </div>
    </PageWrapper>
  );
}
