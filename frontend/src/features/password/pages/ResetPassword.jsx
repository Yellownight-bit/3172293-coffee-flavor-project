
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/features/auth/services/authService.js";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Completa todos los campos");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener mínimo 8 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const resetToken = sessionStorage.getItem("resetToken");

        if (!resetToken) {
            setError("No tienes autorización para restablecer la contraseña");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await resetPassword(resetToken, password);

            sessionStorage.removeItem("resetToken");
            sessionStorage.removeItem("recoveryEmail");

            alert("Contraseña restablecida correctamente");

            navigate("/auth");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
            style={{
                backgroundImage: "url('/src/assets/images/restaurant.jpg')",
            }}
        >
            <div className="absolute inset-0 bg-overlay/50"></div>

            <div className="relative w-full max-w-md rounded-2xl border border-brand bg-overlay/70 p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-on-brand">
                        Restablecer Contraseña
                    </h1>

                    <p className="mt-2 text-sm text-on-brand/80">
                        Ingresa tu nueva contraseña para recuperar el acceso a
                        tu cuenta
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-on-brand"
                        >
                            Nueva contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu nueva contraseña"
                            disabled={loading}
                            className="w-full rounded-md border border-border-soft bg-panel px-4 py-2.5 text-sm text-text-primary outline-none focus:border-focus-border focus:ring-2 focus:ring-focus-ring"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-on-brand"
                        >
                            Confirmar contraseña
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirma tu nueva contraseña"
                            disabled={loading}
                            className="w-full rounded-md border border-border-soft bg-panel px-4 py-2.5 text-sm text-text-primary outline-none focus:border-focus-border focus:ring-2 focus:ring-focus-ring"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-accent px-4 py-2.5 font-semibold text-on-accent transition hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Restableciendo..." : "Restablecer contraseña"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
