import { useId } from "react";
import { projectedReplacementRate } from "../data/portfolioData";

/**
 * Replacement rate against contribution rate, one line per occupation, with the
 * study's adequacy benchmark drawn across it.
 *
 * On the honesty of the lines: the study publishes a mean replacement rate at a
 * 10% contribution and, separately, the minimum rate each occupation needs for a
 * 75% adequacy probability. It does not publish a curve. In a simple
 * accumulation the fund scales with the contribution rate, so a line through the
 * origin and the published 10% point is the natural illustration - and it lands
 * within 0.7 percentage points of every required rate the simulation found
 * (28.3 vs 29, 22.6 vs 23, 19.3 vs 20). That agreement is why the line is drawn
 * at all, and the caption says plainly that it illustrates rather than re-runs
 * the simulation.
 *
 * Hand-drawn SVG rather than a charting library: the whole component is smaller
 * than any dependency would be, it inherits the page's own colour tokens in both
 * themes, and nothing has to be allow-listed in the CSP.
 */

const VIEW = { width: 760, height: 440 };
const PAD = { top: 28, right: 20, bottom: 56, left: 62 };

const X = { min: 5, max: 40 };
const Y = { min: 0, max: 85 };

const X_TICKS = [5, 10, 15, 20, 25, 30, 35, 40];
const Y_TICKS = [0, 20, 40, 60, 80];

/** Distinct hue and dash per series, so the chart survives greyscale printing. */
const SERIES = {
  boda: { color: "var(--chart-series-1)", dash: "" },
  vendor: { color: "var(--chart-series-2)", dash: "7 5" },
  artisan: { color: "var(--chart-series-3)", dash: "2 4" },
};

const plot = {
  width: VIEW.width - PAD.left - PAD.right,
  height: VIEW.height - PAD.top - PAD.bottom,
};

function scaleX(value) {
  return PAD.left + ((value - X.min) / (X.max - X.min)) * plot.width;
}

function scaleY(value) {
  return PAD.top + plot.height - ((value - Y.min) / (Y.max - Y.min)) * plot.height;
}

/** Contribution rate at which the line reaches the benchmark. */
function crossingRate(stratum, benchmark) {
  return (benchmark * 10) / stratum.replacementRate;
}

export default function ReplacementRateChart({
  strata,
  benchmark,
  contributionRate,
  selectedId,
}) {
  const titleId = useId();
  const cursorX = scaleX(contributionRate);

  return (
    <figure className="chart">
      <svg
        className="chart-svg"
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        role="img"
        aria-labelledby={titleId}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={titleId}>
          Replacement rate against contribution rate for three occupations, with the{" "}
          {benchmark.value}% adequacy benchmark. At the current {contributionRate}% contribution,
          every occupation sits {contributionRate < 19 ? "below" : "around or above"} the benchmark.
        </title>

        {Y_TICKS.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              className="chart-grid"
              x1={PAD.left}
              x2={PAD.left + plot.width}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
            />
            <text className="chart-tick" x={PAD.left - 12} y={scaleY(tick)} textAnchor="end" dy="0.32em">
              {tick}%
            </text>
          </g>
        ))}

        {X_TICKS.map((tick) => (
          <text
            key={`x-${tick}`}
            className="chart-tick"
            x={scaleX(tick)}
            y={PAD.top + plot.height + 24}
            textAnchor="middle"
          >
            {tick}%
          </text>
        ))}

        <line
          className="chart-axis"
          x1={PAD.left}
          x2={PAD.left + plot.width}
          y1={PAD.top + plot.height}
          y2={PAD.top + plot.height}
        />

        {/* The target the simulation scored against. */}
        <line
          className="chart-benchmark"
          x1={PAD.left}
          x2={PAD.left + plot.width}
          y1={scaleY(benchmark.value)}
          y2={scaleY(benchmark.value)}
        />
        {/* Anchored left, where the lines are still low, so it never sits on
            top of a series or the crossing markers on the right. */}
        <text
          className="chart-benchmark-label"
          x={PAD.left + 8}
          y={scaleY(benchmark.value) - 10}
          textAnchor="start"
        >
          {benchmark.value}% adequacy benchmark
        </text>

        {/* Where the study's own 10% observation sits, and where each line crosses. */}
        {strata.map((stratum) => {
          const series = SERIES[stratum.id];
          const dimmed = selectedId && selectedId !== stratum.id;
          const crossing = crossingRate(stratum, benchmark.value);
          return (
            <g key={stratum.id} opacity={dimmed ? 0.5 : 1}>
              <line
                stroke={series.color}
                strokeWidth={dimmed ? 2 : 3}
                strokeDasharray={series.dash || undefined}
                strokeLinecap="round"
                x1={scaleX(X.min)}
                y1={scaleY(projectedReplacementRate(stratum, X.min))}
                x2={scaleX(X.max)}
                y2={scaleY(projectedReplacementRate(stratum, X.max))}
              />
              <circle
                cx={scaleX(10)}
                cy={scaleY(stratum.replacementRate)}
                r="5"
                fill={series.color}
                stroke="var(--chart-surface)"
                strokeWidth="2"
              />
              {crossing <= X.max ? (
                <g>
                  <circle
                    cx={scaleX(crossing)}
                    cy={scaleY(benchmark.value)}
                    r="4"
                    fill="var(--chart-surface)"
                    stroke={series.color}
                    strokeWidth="2.5"
                  />
                  <text
                    className="chart-annotation"
                    x={scaleX(crossing)}
                    y={scaleY(benchmark.value) + 22}
                    textAnchor="middle"
                    fill={series.color}
                  >
                    {stratum.requiredRate}%
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {/* Cursor tied to the contribution slider. */}
        <line
          className="chart-cursor"
          x1={cursorX}
          x2={cursorX}
          y1={PAD.top}
          y2={PAD.top + plot.height}
        />
        {strata.map((stratum) => (
          <circle
            key={`cursor-${stratum.id}`}
            cx={cursorX}
            cy={scaleY(Math.min(projectedReplacementRate(stratum, contributionRate), Y.max))}
            r={selectedId === stratum.id ? 6 : 4}
            fill={SERIES[stratum.id].color}
            stroke="var(--chart-surface)"
            strokeWidth="2"
            opacity={selectedId && selectedId !== stratum.id ? 0.55 : 1}
          />
        ))}

        <text
          className="chart-axis-label"
          x={PAD.left + plot.width / 2}
          y={VIEW.height - 8}
          textAnchor="middle"
        >
          Contribution rate, share of positive-day surplus
        </text>
        <text
          className="chart-axis-label"
          transform={`rotate(-90 16 ${PAD.top + plot.height / 2})`}
          x="16"
          y={PAD.top + plot.height / 2}
          textAnchor="middle"
        >
          Replacement rate
        </text>
      </svg>

      <ul className="chart-legend">
        {strata.map((stratum) => (
          <li key={stratum.id} className={selectedId === stratum.id ? "is-selected" : ""}>
            <svg width="26" height="10" aria-hidden="true">
              <line
                x1="1"
                y1="5"
                x2="25"
                y2="5"
                stroke={SERIES[stratum.id].color}
                strokeWidth="3"
                strokeDasharray={SERIES[stratum.id].dash || undefined}
                strokeLinecap="round"
              />
            </svg>
            {stratum.name}
          </li>
        ))}
      </ul>

      {/*
        A chart is not readable by a screen reader, so the same numbers are
        offered as a table rather than left behind an image description.
      */}
      <table className="sr-only">
        <caption>
          Replacement rate by occupation at a {contributionRate}% contribution rate, against the{" "}
          {benchmark.value}% adequacy benchmark
        </caption>
        <thead>
          <tr>
            <th scope="col">Occupation</th>
            <th scope="col">Mean replacement rate at 10% (study)</th>
            <th scope="col">Illustrated rate at {contributionRate}%</th>
            <th scope="col">Contribution rate required for adequacy (study)</th>
          </tr>
        </thead>
        <tbody>
          {strata.map((stratum) => (
            <tr key={stratum.id}>
              <th scope="row">{stratum.name}</th>
              <td>{stratum.replacementRate}%</td>
              <td>{projectedReplacementRate(stratum, contributionRate).toFixed(1)}%</td>
              <td>{stratum.requiredRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
