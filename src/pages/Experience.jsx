import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { IconArrow } from "../components/Icons";
import { experience } from "../data/portfolioData";

export default function Experience() {
  return (
    <PageWrapper>
      <div className="wrap py-14 sm:py-16 lg:py-20">
        <p className="eyebrow">Experience</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Professional experience
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Data visualisation, budget analysis and financial reporting.
        </p>

        <div className="mt-14 space-y-14">
          {experience.map((job) => (
            <article key={job.id} className="border-t border-ink pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-sm text-ink-muted">{job.period}</p>
                <p className="text-sm text-ink-muted">{job.location}</p>
              </div>
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink">{job.title}</h2>
              <p className="mt-2 text-lg text-ink-soft">{job.company}</p>
              <ul className="mt-6 max-w-3xl space-y-3">
                {job.highlights.map((line) => (
                  <li key={line} className="flex gap-3 text-[1.05rem] leading-relaxed text-ink">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-muted">{job.tools.join("  |  ")}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-rule pt-10 sm:flex-row sm:items-center">
          <p className="max-w-xl text-ink-soft">If this looks relevant to your team, I would be glad to talk.</p>
          <Link to="/contact" className="btn btn-primary">
            Contact
            <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
