
import { API_URL } from "@/features/config";

const USERS_URL = `${API_URL}/users`;

// Convierte los datos del usuario a FormData
function createUserFormData(userData) {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
        if (key === "userImage") {
            if (Array.isArray(value)) {
                value.forEach((file) => {
                    if (file instanceof File) {
                        formData.append("userImage", file);
                    }
                });
            } else if (value instanceof File) {
                formData.append("userImage", value);
            }

            return;
        }

        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    return formData;
}

// Crear un usuario desde el sistema
export async function createUser(userData) {
    const token = sessionStorage.getItem("token");
    const formData = createUserFormData(userData);

    const response = await fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el usuario");
    }

    return response.json();
}

// Registrar un usuario desde el login
export async function registerUser(userData) {
    const formData = userData instanceof FormData
        ? userData
        : createUserFormData(userData);

    const response = await fetch(`${USERS_URL}/register`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar el usuario");
    }

    return response.json();
}

// Consultar todos los usuarios
export async function getAllUsers() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(USERS_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al consultar los usuarios");
    }

    return response.json();
}

// Consultar usuarios para gestión de permisos
export async function getUsersForPermissions() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_URL}/permissions`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al consultar usuarios para permisos");
    }

    return response.json();
}

// Actualizar los datos de un usuario
export async function updateUser(id, userData) {
    const token = sessionStorage.getItem("token");
    const formData = createUserFormData(userData);

    const response = await fetch(`${USERS_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Detalle del error del backend:", data);
        throw new Error(data.error || "Error al actualizar el usuario");
    }

    return data;
}

// Actualizar únicamente el estado del usuario
export async function updateStatusSwitch(id, is_active) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Detalle del error del backend:", data);
        throw new Error(data.error || "Error al cambiar el estado");
    }

    return data;
}
