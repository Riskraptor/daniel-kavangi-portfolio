import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { IconArrow } from "../components/Icons";
import ReplacementRateChart from "../components/ReplacementRateChart";
import { featuredProject, otherProjects, projectedReplacementRate } from "../data/portfolioData";

const money = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function Metric({ value, label, detail }) {
  return (
    <div className="border-t border-rule pt-4">
      <p className="font-serif text-3xl font-medium tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
      {detail ? <p className="mt-1 text-sm leading-relaxed text-ink-muted">{detail}</p> : null}
    </div>
  );
}

export default function Work() {
  const [stratumId, setStratumId] = useState("boda");
  const [contributionRate, setContributionRate] = useState(10);
  const selected = featuredProject.strata.find((item) => item.id === stratumId) || featuredProject.strata[0];

  const scenario = useMemo(() => {
    return {
      dailyContribution: (selected.positiveDaySurplus * contributionRate) / 100,
      projected: projectedReplacementRate(selected, contributionRate),
      gap: selected.requiredRate - contributionRate,
    };
  }, [contributionRate, selected]);

  return (
    <PageWrapper>
      <section className="border-b border-rule">
        <div className="wrap py-14 sm:py-16 lg:py-20">
          <p className="eyebrow">{featuredProject.label} · Featured project</p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {featuredProject.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft sm:text-xl">{featuredProject.summary}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{featuredProject.context}</p>
        </div>
      </section>

      <section className="border-b border-rule bg-surface">
        <div className="wrap py-12 sm:py-16">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProject.scope.map((item) => (
              <Metric key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Research design</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">From volatile cash flow to a retirement projection</h2>
          </div>
          <ol className="space-y-5">
            {featuredProject.methods.map((method, index) => (
              <li key={method} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-rule pt-4">
                <span className="font-serif text-xl text-bronze-on-paper">0{index + 1}</span>
                <p className="text-[1.05rem] leading-relaxed text-ink-soft">{method}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-rule bg-ink text-paper">
        <div className="wrap py-16 sm:py-20">
          <p className="eyebrow text-bronze-on-ink">What the model found</p>
          <h2 className="mt-3 max-w-4xl font-serif text-3xl font-medium tracking-tight sm:text-4xl">A standard 10% contribution was not enough.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-paper/75">{featuredProject.finding}</p>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {featuredProject.strata.map((item) => (
              <article key={item.id} className="border-t border-paper/25 pt-5">
                <p className="text-sm font-semibold text-paper">{item.name}</p>
                <p className="mt-5 font-serif text-5xl text-bronze-on-ink">{item.replacementRate}%</p>
                <p className="mt-1 text-sm text-paper/65">mean replacement rate at 10%</p>
                <div className="mt-6 h-px w-full bg-paper/20" />
                <p className="mt-4 text-sm text-paper/70">{item.zeroDays}% of diary days had no surplus available for saving.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap py-16 sm:py-20">
          <p className="eyebrow">Scenario explorer</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Where each occupation crosses the adequacy benchmark
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            Each line runs through that occupation's published replacement rate at a 10% contribution.
            The dots on the benchmark mark the contribution rate the simulation identified for a{" "}
            {featuredProject.adequacyTarget}% adequacy probability. Move the slider to read any rate off the chart.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
            <div className="border border-rule bg-surface p-4 sm:p-7">
              <ReplacementRateChart
                strata={featuredProject.strata}
                benchmark={featuredProject.benchmark}
                contributionRate={contributionRate}
                selectedId={stratumId}
              />
            </div>

            <div className="border border-rule bg-surface p-6 sm:p-7">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Worker group">
                {featuredProject.strata.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStratumId(item.id)}
                    className={`scenario-choice ${item.id === selected.id ? "is-selected" : ""}`}
                    aria-pressed={item.id === selected.id}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor="contribution-rate" className="text-sm font-semibold text-ink">
                    Contribution rate
                  </label>
                  <output htmlFor="contribution-rate" className="font-serif text-4xl text-ink">
                    {contributionRate}%
                  </output>
                </div>
                <input
                  id="contribution-rate"
                  className="scenario-range mt-4 w-full"
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={contributionRate}
                  onChange={(event) => setContributionRate(Number(event.target.value))}
                />
                <div className="mt-1 flex justify-between text-xs text-ink-muted">
                  <span>5%</span>
                  <span>40%</span>
                </div>
              </div>

              <p className="mt-7 border-t border-rule pt-6 text-[1.02rem] leading-relaxed text-ink-soft">
                At <strong className="font-semibold text-ink">{contributionRate}%</strong>, {selected.name.toLowerCase()}{" "}
                reach an illustrated{" "}
                <strong className="font-semibold text-ink">{scenario.projected.toFixed(1)}%</strong> replacement rate.
              </p>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">
                {scenario.gap > 0 ? (
                  <>
                    The simulation put the contribution needed for adequacy at{" "}
                    <strong className="font-semibold text-ink">{selected.requiredRate}%</strong> &mdash;{" "}
                    {scenario.gap} percentage points above where the slider sits.
                  </>
                ) : (
                  <>
                    That is at or above the{" "}
                    <strong className="font-semibold text-ink">{selected.requiredRate}%</strong> contribution the
                    simulation identified for this group.
                  </>
                )}
              </p>

              <div className="mt-6 grid gap-5">
                <Metric
                  value={money.format(scenario.dailyContribution)}
                  label="illustrative positive-day contribution"
                  detail={`Based on the ${money.format(selected.positiveDaySurplus)} mean positive-day surplus in the study.`}
                />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                The lines illustrate the published aggregates. They do not rerun the study's simulation, and this is
                not financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap grid gap-8 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Design implication</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">The product must adapt to income—not force income to adapt to the product.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">{featuredProject.recommendation}</p>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">{featuredProject.note}</p>
            <Link to="/contact" className="btn btn-primary mt-8">Discuss this work <IconArrow className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Renders nothing until a second project exists, so adding one to the
          projects array is all it takes to see it here. */}
      {otherProjects.length > 0 ? (
        <section className="border-t border-rule">
          <div className="wrap py-16 sm:py-20">
            <p className="eyebrow">More work</p>
            <ul className="mt-8 divide-y divide-rule border-y border-rule">
              {otherProjects.map((project) => (
                <li key={project.id} className="grid gap-3 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
                  <p className="text-sm text-ink-muted">{project.label}</p>
                  <div>
                    <h3 className="font-serif text-2xl font-medium tracking-tight text-ink">
                      {project.shortTitle || project.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink-soft">
                      {project.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </PageWrapper>
  );
}
