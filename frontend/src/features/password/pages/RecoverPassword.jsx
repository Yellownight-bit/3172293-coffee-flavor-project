
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recoverPassword } from "@/features/auth/services/authService.js";

const RecoverPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Ingresa tu correo electrónico");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await recoverPassword(email.trim());

            sessionStorage.setItem("recoveryEmail", email.trim());

            navigate("/verify-code");
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
                        Recuperar Contraseña
                    </h1>

                    <p className="mt-2 text-sm text-on-brand/80">
                        Ingresa tu correo registrado para recibir el código de
                        recuperación
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-on-brand"
                        >
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
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
                        {loading ? "Enviando código..." : "Enviar código de recuperación"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/auth")}
                        className="w-full text-sm font-medium text-on-brand hover:text-accent"
                    >
                        Volver al inicio de sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RecoverPassword;
