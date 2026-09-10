export default function Tabs({ tabs, value, onChange, label }) {
  function moveFocus(event, currentIndex) {
    const key = event.key;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = tabs.length - 1;
    const next = tabs[nextIndex];
    onChange(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <div className="tablist" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={value === tab.id}
            /* Roving tabindex: one stop for the whole tablist, then arrow keys
               move between tabs. Every tab being tabbable made a keyboard user
               step through all of them to reach the panel. */
            tabIndex={value === tab.id ? 0 : -1}
            className="tab"
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => moveFocus(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) =>
        value === tab.id ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            className="fade-in pt-8 outline-none"
          >
            {tab.content}
          </div>
        ) : null
      )}
    </div>
  );
}
