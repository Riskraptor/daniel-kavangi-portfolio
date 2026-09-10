import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import ResumeButton from "../components/ResumeButton";
import SmartImage from "../components/SmartImage";
import { IconArrow, IconPin } from "../components/Icons";
import { education, experience, fitAreas, focusAreas, personalInfo, featuredProject, toolkit } from "../data/portfolioData";

export default function Home() {
  const degree = education[0];

  return (
    <PageWrapper>
      <section className="border-b border-rule">
        <div className="wrap grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
          <div className="hero-copy">
            <p className="eyebrow">Nairobi, Kenya</p>
            <h1 className="mt-4 font-serif text-[2.6rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-[4.15rem]">
              {personalInfo.name}
            </h1>
            <p className="mt-5 max-w-xl border-l-2 border-bronze pl-4 text-lg text-ink-soft sm:text-xl">
              {personalInfo.headline}
            </p>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">{personalInfo.summary}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
              <IconPin className="h-4 w-4" />
              {personalInfo.location}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ResumeButton />
              <Link to="/work" className="btn btn-secondary">
                Selected work
                <IconArrow className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact
              </Link>
            </div>
          </div>

          <figure className="hero-frame mx-auto w-full max-w-sm lg:max-w-none">
            <div className="overflow-hidden border border-ink/15 bg-paper-2 p-2">
              <SmartImage
                name={personalInfo.photo}
                alt={`Portrait of ${personalInfo.name}`}
                width={900}
                height={1200}
                priority
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 384px, calc(100vw - 2.5rem)"
                className="aspect-[3/4] w-full object-cover object-[center_22%] transition duration-500 hover:scale-[1.03]"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="border-b border-rule bg-surface">
        <div className="wrap grid gap-8 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Evidence, not just keywords
            </h2>
            <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">{featuredProject.summary}</p>
            <Link to="/work" className="btn btn-primary mt-7">
              Explore the research
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <article className="border border-rule bg-paper p-6 sm:p-8">
            <p className="eyebrow">{featuredProject.label}</p>
            <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {featuredProject.shortTitle}
            </h3>
            <div className="mt-7 grid grid-cols-2 divide-x divide-y divide-rule border border-rule sm:grid-cols-4 sm:divide-y-0">
              {featuredProject.scope.map((item) => (
                <div key={item.label} className="px-4 py-4">
                  <p className="font-serif text-2xl font-medium text-ink">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap py-10 sm:py-12">
          <p className="eyebrow">Focus</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[0.98rem] text-ink">
            {focusAreas.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-bronze" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-muted">{toolkit.join("  |  ")}</p>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap py-16 sm:py-20">
          <p className="eyebrow">Fit</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Built for teams that live on numbers
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {fitAreas.map((area) => (
              <article key={area.title} className="lift-card border-t border-rule pt-5">
                <h3 className="font-serif text-xl font-medium text-ink">{area.title}</h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Experience</p>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                Professional work
              </h2>
            </div>
            <Link to="/experience" className="text-link inline-flex items-center gap-2 text-sm">
              Full experience
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 divide-y divide-rule border-y border-rule">
            {experience.map((job) => (
              <article key={job.id} className="grid gap-3 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
                <p className="text-sm text-ink-muted">{job.period}</p>
                <div>
                  <h3 className="font-serif text-2xl font-medium tracking-tight text-ink">{job.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    {job.company} · {job.location}
                  </p>
                  <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink-soft">{job.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap grid gap-8 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Education</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {degree.degree}
            </h2>
            <Link to="/education" className="text-link mt-5 inline-flex items-center gap-2 text-sm">
              Education and certificates
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="panel p-6 sm:p-8">
            <p className="text-sm text-ink-muted">{degree.period}</p>
            <p className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink">{degree.institution}</p>
            <a
              href={degree.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-ink-soft hover:text-ink"
            >
              chuka.ac.ke
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center sm:py-20">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium tracking-tight text-ink">
              {personalInfo.availability}.
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">{personalInfo.seeking}</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Get in touch
            <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
