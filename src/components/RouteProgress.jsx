import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteProgress() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(hide);
  }, [pathname]);

  if (!visible) return null;
  return <div className="route-progress" aria-hidden="true" />;
}
