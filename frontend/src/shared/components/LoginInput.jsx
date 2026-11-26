
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const Icon = isPassword ? Lock : Mail;

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[#59483f] mb-2"
      >
        {label}
      </label>

      <div
        className={`
          flex items-center
          w-full h-[54px]
          border rounded-md
          bg-[#fbf2ed]
          transition-all
          ${error
            ? "border-red-500"
            : "border-[#a58c7e] focus-within:border-[#a45328] focus-within:ring-1 focus-within:ring-[#a45328]"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex items-center justify-center px-4 border-r border-[#c9b5a9]">
          <Icon size={21} strokeWidth={1.7} className="text-[#715c50]" />
        </div>

        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className="
            w-full h-full
            px-4
            bg-transparent
            outline-none
            text-[#49382e]
            placeholder:text-[#9a8579]
            text-base
            disabled:cursor-not-allowed
          "
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="flex items-center justify-center px-4 h-full text-[#715c50] hover:text-[#a45328] transition-colors disabled:cursor-not-allowed"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff size={21} strokeWidth={1.7} />
            ) : (
              <Eye size={21} strokeWidth={1.7} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
