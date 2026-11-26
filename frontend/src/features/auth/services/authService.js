
import { API_URL } from "@/features/config";

const AUTH_API_URL = `${API_URL}/auth`;

// Iniciar sesión
export async function login(userData) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userData.email || userData.userEmail,
            password: userData.password || userData.userPassword,
            acceptedDataPolicy: userData.acceptedDataPolicy === true,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    return data;
}

// Solicitar recuperación de contraseña
export async function recoverPassword(email) {
    const response = await fetch(`${AUTH_API_URL}/recover-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al solicitar la recuperación");
    }

    return data;
}

// Verificar código de recuperación
export async function verifyResetCode(email, code) {
    const response = await fetch(`${AUTH_API_URL}/verify-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al verificar el código");
    }

    return data;
}

// Restablecer contraseña
export async function resetPassword(resetToken, password) {
    const response = await fetch(`${AUTH_API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña");
    }

    return data;
}
