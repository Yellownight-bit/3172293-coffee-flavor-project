
import { ArrowRight } from "lucide-react";

export default function LoginButton({
  children = "Iniciar sesión",
  type = "submit",
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="
        flex items-center justify-center gap-2
        w-full min-h-12
        px-6
        rounded-lg
        bg-[var(--color-primary-800)]
        text-white
        font-semibold text-base
        transition-colors
        hover:bg-[var(--color-primary-950)]
        active:scale-[0.98]
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[var(--color-primary-950)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-[var(--color-primary-800)]
      "
    >
      {children}

      <ArrowRight size={16} strokeWidth={2} />
    </button>
  );
}
