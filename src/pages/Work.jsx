import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { IconArrow } from "../components/Icons";
import { researchProject } from "../data/portfolioData";

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
  const selected = researchProject.strata.find((item) => item.id === stratumId) || researchProject.strata[0];

  const scenario = useMemo(() => {
    const dailyContribution = (selected.positiveDaySurplus * contributionRate) / 100;
    const thresholdProgress = Math.min(100, (contributionRate / selected.requiredRate) * 100);
    const gap = selected.requiredRate - contributionRate;
    return {
      dailyContribution,
      thresholdProgress,
      gap,
    };
  }, [contributionRate, selected]);

  return (
    <PageWrapper>
      <section className="border-b border-rule">
        <div className="wrap py-14 sm:py-16 lg:py-20">
          <p className="eyebrow">{researchProject.label} · Featured project</p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {researchProject.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft sm:text-xl">{researchProject.summary}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{researchProject.context}</p>
        </div>
      </section>

      <section className="border-b border-rule bg-surface">
        <div className="wrap py-12 sm:py-16">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {researchProject.scope.map((item) => (
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
            {researchProject.methods.map((method, index) => (
              <li key={method} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-rule pt-4">
                <span className="font-serif text-xl text-bronze">0{index + 1}</span>
                <p className="text-[1.05rem] leading-relaxed text-ink-soft">{method}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-rule bg-ink text-paper">
        <div className="wrap py-16 sm:py-20">
          <p className="eyebrow text-bronze">What the model found</p>
          <h2 className="mt-3 max-w-4xl font-serif text-3xl font-medium tracking-tight sm:text-4xl">A standard 10% contribution was not enough.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-paper/75">{researchProject.finding}</p>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {researchProject.strata.map((item) => (
              <article key={item.id} className="border-t border-paper/25 pt-5">
                <p className="text-sm font-semibold text-paper">{item.name}</p>
                <p className="mt-5 font-serif text-5xl text-bronze">{item.replacementRate}%</p>
                <p className="mt-1 text-sm text-paper/65">mean replacement rate at 10%</p>
                <div className="mt-6 h-px w-full bg-paper/20" />
                <p className="mt-4 text-sm text-paper/70">{item.zeroDays}% of diary days had no surplus available for saving.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="wrap grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Scenario explorer</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">Compare a contribution rate with the research threshold</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              This explorer makes the published aggregate findings easier to interpret. It is not financial advice and does not rerun the study’s simulation.
            </p>
          </div>

          <div className="border border-rule bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Worker group">
              {researchProject.strata.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStratumId(item.id)}
                  className={`scenario-choice ${item.id === selected.id ? "is-selected" : ""}`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="mt-9">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="contribution-rate" className="text-sm font-semibold text-ink">Contribution rate</label>
                <output htmlFor="contribution-rate" className="font-serif text-4xl text-ink">{contributionRate}%</output>
              </div>
              <input
                id="contribution-rate"
                className="scenario-range mt-5 w-full"
                type="range"
                min="5"
                max="40"
                step="1"
                value={contributionRate}
                onChange={(event) => setContributionRate(Number(event.target.value))}
              />
              <div className="mt-2 flex justify-between text-xs text-ink-muted"><span>5%</span><span>40%</span></div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Metric
                value={money.format(scenario.dailyContribution)}
                label="illustrative positive-day contribution"
                detail={`Based on the ${money.format(selected.positiveDaySurplus)} mean positive-day surplus in the study.`}
              />
              <Metric
                value={`${selected.requiredRate}%`}
                label="research threshold"
                detail={`Minimum rate identified for the model's 75% adequacy-probability target.`}
              />
            </div>
            <div className="mt-8">
              <div className="flex justify-between gap-4 text-sm"><span className="font-semibold text-ink">Progress toward the threshold</span><span className="text-ink-muted">{Math.round(scenario.thresholdProgress)}%</span></div>
              <div className="mt-3 h-2 overflow-hidden bg-rule"><div className="h-full bg-accent transition-all duration-300" style={{ width: `${scenario.thresholdProgress}%` }} /></div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {scenario.gap > 0
                  ? `${scenario.gap} percentage points below the occupation-calibrated rate tested in the research.`
                  : "At or above the occupation-calibrated rate tested in the research."}
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
            <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">{researchProject.recommendation}</p>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">{researchProject.note}</p>
            <Link to="/contact" className="btn btn-primary mt-8">Discuss this work <IconArrow className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
