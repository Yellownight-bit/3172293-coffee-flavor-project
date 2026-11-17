
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const INACTIVITY_TIME = 15 * 60 * 1000;

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    let inactivityTimer;

    const logout = () => {
      sessionStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/auth", { replace: true });
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIME);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [token, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children || <Outlet />;
}
