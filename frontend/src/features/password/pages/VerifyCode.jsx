
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { verifyResetCode } from "@/features/auth/services/authService.js";

const VerifyCode = () => {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{6}$/.test(code)) {
            setError("Ingresa un código válido de seis dígitos");
            return;
        }

        const email = sessionStorage.getItem("recoveryEmail");

        if (!email) {
            setError("No encontramos una solicitud de recuperación");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await verifyResetCode(email, code);

            sessionStorage.setItem("resetToken", data.resetToken);

            navigate("/reset-password");
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

                <Button
                    variant="back"
                    size="back"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    <span>←</span> Atrás
                </Button>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-on-brand">
                        Verificar Código
                    </h1>

                    <p className="mt-2 text-sm text-on-brand/80">
                        Ingresa el código que enviamos a tu correo
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="code"
                            className="mb-2 block text-sm font-medium text-on-brand"
                        >
                            Código de verificación
                        </label>

                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            value={code}
                            onChange={(e) =>
                                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            placeholder="123456"
                            maxLength={6}
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
                        {loading ? "Verificando..." : "Verificar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyCode;
