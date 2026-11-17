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
        flex items-center justify-center gap-3
        w-full h-[50px]
        rounded-full
        bg-[var(--color-primary-950)]
        text-white
        font-semibold
        text-base
        transition-all duration-200
        hover:bg-[var(--color-primary-900)]
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-[var(--color-primary-950)]
      "
    >
      <ArrowRight size={20} />
      {children}
    </button>
  );
}