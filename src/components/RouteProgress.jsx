import { useLocation } from "react-router-dom";

/**
 * A one-shot loading bar. Remounting on `pathname` replays the CSS animation,
 * which fills forwards to transparent, so no timer or state is needed.
 */
export default function RouteProgress() {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-progress" aria-hidden="true" />;
}
