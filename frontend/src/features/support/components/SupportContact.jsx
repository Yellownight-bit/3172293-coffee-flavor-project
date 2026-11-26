
import { useEffect, useState } from "react";
import { Headset, Mail, X } from "lucide-react";
import { API_URL } from "@/features/config";

export default function SupportContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [supportEmail, setSupportEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupportEmail = async () => {
            try {
                const response = await fetch(`${API_URL}/support`);

                if (!response.ok) {
                    throw new Error("No se pudo consultar el correo");
                }

                const data = await response.json();

                setSupportEmail(data.support_email || "");
            } catch (error) {
                console.error("Error consultando soporte:", error);
                setSupportEmail("");
            } finally {
                setLoading(false);
            }
        };

        fetchSupportEmail();
    }, []);

    return (
        <div className="fixed left-5 bottom-6 z-50 flex flex-col items-start gap-3">
            {isOpen && (
                <div className="w-72 rounded-2xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[var(--color-primary-900)]">
                            <Headset size={20} />
                            <h3 className="font-bold">
                                Soporte del sistema
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-[var(--color-primary-800)] hover:opacity-70"
                            aria-label="Cerrar soporte"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                        ¿Necesitas ayuda? Comunícate con nosotros a través
                        del siguiente correo:
                    </p>

                    {loading ? (
                        <p className="text-sm text-gray-500">
                            Cargando correo...
                        </p>
                    ) : supportEmail ? (
                        <a
                            href={`mailto:${supportEmail}`}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-700)] hover:underline break-all"
                        >
                            <Mail size={17} className="shrink-0" />
                            {supportEmail}
                        </a>
                    ) : (
                        <p className="text-sm text-red-600">
                            El correo de soporte no está disponible.
                        </p>
                    )}
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary-700)] px-5 py-3 text-white shadow-lg transition-all hover:bg-[var(--color-primary-800)] hover:scale-105"
                aria-label="Abrir soporte"
                aria-expanded={isOpen}
            >
                {isOpen ? <X size={21} /> : <Headset size={21} />}
                <span className="text-sm font-semibold">
                    Soporte
                </span>
            </button>
        </div>
    );
}
