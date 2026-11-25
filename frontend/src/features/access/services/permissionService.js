
// frontend/src/features/access/services/permissionService.js

const API_URL = "http://localhost:4000/api/groups";
const PERMISSIONS_URL = "http://localhost:4000/api/permissions";
const ACCESS_URL = "http://localhost:4000/api/access";

// Obtener permisos asignados a un grupo
export async function getGroupPermissions(groupId) {
    const response = await fetch(`${API_URL}/${groupId}/permissions`);

    if (!response.ok) {
        throw new Error("Error obteniendo permisos del grupo");
    }

    return response.json();
}

// Obtener todos los permisos disponibles del sistema
export async function getAllPermissions() {
    const response = await fetch(PERMISSIONS_URL);

    if (!response.ok) {
        throw new Error("Error obteniendo permisos");
    }

    return response.json();
}

// Obtener permisos directos y heredados de un usuario
export async function getUserPermissionDetails(userId) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `${ACCESS_URL}/users/${userId}/permissions`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error("Error obteniendo los permisos del usuario");
    }

    return response.json();
}

// Actualizar permisos individuales de un usuario

export async function updateUserPermissions(userId, permissionIds) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `${ACCESS_URL}/users/${userId}/permissions`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                permissionIds,
            }),
        },
    );

    const responseText = await response.text();

    let data;

    try {
        data = JSON.parse(responseText);
    } catch {
        throw new Error(
            `El servidor respondió con un formato inesperado (HTTP ${response.status}). Verifica que la ruta PUT esté registrada en el backend.`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.error || "Error actualizando los permisos del usuario"
        );
    }

    return data;
}

export async function checkUserPermission(permissionCode) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `${ACCESS_URL}/check/${permissionCode}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error("Error verificando el permiso");
    }

    const data = await response.json();

    return data.granted;
}



