
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { checkUserPermission } from "@/features/access/services/permissionService";

const INACTIVITY_TIME = 10 * 60 * 1000;

const getUserRole = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)).rol || "";
  } catch {
    return "";
  }
};

export default function ProtectedRoute({ children, permission, role }) {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [hasPermission, setHasPermission] = useState(null);

  const userRole = getUserRole(token || "");

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    let inactivityTimer;

    const logout = () => {
      sessionStorage.setItem("sessionExpired", "true");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("rol");
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

  useEffect(() => {
    let cancelled = false;

    const verifyPermission = async () => {
      if (!permission) {
        setHasPermission(true);
        return;
      }

      setHasPermission(null);

      try {
        const granted = await checkUserPermission(permission);

        if (!cancelled) {
          setHasPermission(granted);
        }
      } catch (error) {
        console.error("Error verificando permiso:", error);

        if (!cancelled) {
          setHasPermission(false);
        }
      }
    };

    if (token) {
      verifyPermission();
    }

    return () => {
      cancelled = true;
    };
  }, [permission, token]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (role && userRole.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/HomePage" replace />;
  }

  if (permission && hasPermission === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Verificando permisos...
      </div>
    );
  }

  if (permission && !hasPermission) {
    return <Navigate to="/HomePage" replace />;
  }

  return children || <Outlet />;
}
