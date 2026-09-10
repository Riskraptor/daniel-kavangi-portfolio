import { useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import SocialLinks from "../components/SocialLinks";
import SmartImage from "../components/SmartImage";
import Tabs from "../components/Tabs";
import { IconArrow } from "../components/Icons";
import { languages, personalInfo, skillMeta, skills } from "../data/portfolioData";

function ProfilePanel() {
  return (
    <div className="max-w-2xl">
      <p className="text-[1.05rem] leading-relaxed text-ink-soft">{personalInfo.bio}</p>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
        I use Python, R and Microsoft Excel, including VBA, to analyse data and present findings clearly. I care about
        technology, especially fintech, and how quantitative work improves products, credit, insurance and operations.
      </p>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
        At Excelerate I used Python, R and Excel to build charts and dashboards for visual reporting. At Machakos County Assembly I supported
        departmental budgets, expenditure tracking and financial documentation.
      </p>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">{personalInfo.seeking}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {languages.map((lang) => (
          <div key={lang.name} className="border border-rule px-4 py-3">
            <p className="font-medium text-ink">{lang.name}</p>
            <p className="mt-1 text-sm text-ink-muted">{lang.level}</p>
          </div>
        ))}
      </div>
      <Link to="/education" className="text-link mt-8 inline-flex items-center gap-2 text-sm">
        Education and certificates
        <IconArrow className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SkillsPanel() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {Object.entries(skills).map(([key, items]) => (
        <article key={key} className={`border-t border-rule pt-5 ${key === "professional" ? "sm:col-span-2" : ""}`}>
          <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">{skillMeta[key].label}</h3>
          <p className="mt-2 text-sm text-ink-muted">{skillMeta[key].blurb}</p>
          <ul className="mt-4 space-y-3">
            {items.map((skill) => (
              <li key={skill.name} className="flex gap-2 text-[1.02rem] text-ink">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-bronze" aria-hidden="true" />
                <span>
                  {skill.name}
                  {skill.evidence ? (
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      {skill.evidence.map((item) => (
                        <Link
                          key={item.to + item.label}
                          to={item.to}
                          className="inline-flex items-center gap-1 text-[0.82rem] font-semibold text-accent hover:underline"
                        >
                          <IconArrow className="h-3 w-3" />
                          {item.label}
                        </Link>
                      ))}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function About() {
  const [tab, setTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", content: <ProfilePanel /> },
    { id: "skills", label: "Skills", content: <SkillsPanel /> },
  ];

  return (
    <PageWrapper>
      <div className="wrap py-14 sm:py-16 lg:py-20">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Who I am
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Actuarial training, data analysis and a serious interest in finance technology.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="border border-ink/15 bg-paper-2 p-2">
                <SmartImage
                  name={personalInfo.photo}
                  alt={`Portrait of ${personalInfo.name}`}
                  width={900}
                  height={1200}
                  priority
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, calc(100vw - 2.5rem)"
                  className="aspect-[4/5] w-full object-cover object-[center_22%]"
                />
              </div>
              <div className="mt-5">
                <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">{personalInfo.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">{personalInfo.location}</p>
                <div className="mt-5">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Tabs tabs={tabs} value={tab} onChange={setTab} label="About sections" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
