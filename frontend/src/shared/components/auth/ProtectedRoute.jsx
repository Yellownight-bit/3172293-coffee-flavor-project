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

  // true cuando la sesión se cerró por inactividad
  const [expired, setExpired] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const userRole = getUserRole(token || "");

  // Cerrar sesión por inactividad
  useEffect(() => {
    if (!token) return;

    let inactivityTimer;

    const logout = () => {
      sessionStorage.setItem("sessionExpired", "true");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("rol");
      setExpired(true);
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

  // Verificar el permiso de la ruta
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

  if (!token || expired) {
    return <Navigate to="/auth" replace />;
  }

  if (role && userRole.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/HomePage" replace />;
  }

  if (permission && hasPermission === null) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-background text-medium text-text-secondary"
      >
        Verificando permisos...
      </div>
    );
  }

  if (permission && !hasPermission) {
    return <Navigate to="/HomePage" replace />;
  }

  return children || <Outlet />;
}