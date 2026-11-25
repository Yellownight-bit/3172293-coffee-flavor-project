
import { useEffect, useState } from "react";
import { Button, DetailItem, StatusSwitch } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAllUsers,
    updateStatusSwitch,
} from "../services/userServices.js";
import { checkUserPermission } from "@/features/access/services/permissionService";
import { API_URL } from "@/features/config";

export default function ReadUser() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canDisableUser, setCanDisableUser] = useState(false);
    const [canUpdateUser, setCanUpdateUser] = useState(false);

    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http")) return image;

        const serverUrl = API_URL.replace(/\/api\/?$/, "");

        return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
    };

    useEffect(() => {

        const loadUser = async () => {
            try {
                setLoading(true);

                try {
                    const [canDisable, canUpdate] = await Promise.all([
                        checkUserPermission("disable_user"),
                        checkUserPermission("update_user"),
                    ]);

                    setCanDisableUser(canDisable);
                    setCanUpdateUser(canUpdate);

                } catch (error) {
                    console.error("Error al verificar los permisos:", error);
                    setCanDisableUser(false);
                    setCanUpdateUser(false);
                }

                const users = await getAllUsers();

                const userData = users.find(
                    (user) => Number(user.id) === Number(id)
                );

                if (userData) {
                    setUser({
                        id: userData.id,
                        userName: userData.user_name,
                        userImage: userData.user_image,
                        documentType: userData.user_document_types,
                        documentNumber: userData.user_document_number,
                        userType: userData.is_superuser
                            ? "Administrador"
                            : userData.is_staff
                                ? "Empleado"
                                : "Usuario",
                        userEmail: userData.user_email,
                        userPhone: userData.user_phone,
                        address: userData.user_address,
                        startDate: userData.created_at
                            ? new Date(userData.created_at).toLocaleDateString("es-CO")
                            : "Sin definir",
                        status: userData.is_active,
                    });
                } else {
                    setUser(null);
                }

            } catch (error) {
                console.error("Error al cargar el usuario:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();

    }, [id]);

    const handleStatusChange = async (value) => {
        try {
            await updateStatusSwitch(user.id, value);

            setUser((currentUser) => ({
                ...currentUser,
                status: value,
            }));

        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-text-primary">
                Cargando información del usuario...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4 text-text-primary">
                <p>No se encontró el usuario con ID {id}.</p>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate("/dashboard/userList")}
                >
                    ← Atrás
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-panel/80 backdrop-blur-md shadow-lg">

            <div className="flex-1 p-6 flex justify-center items-center">

                <div className="w-full max-w-6xl rounded-3xl shadow-lg p-8 relative text-text-primary border-2 border-border">

                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate("/dashboard/userList")}
                    >
                        ← Atrás
                    </Button>

                    <div className="flex items-center gap-3 mb-8 mt-8 border-b border-border-strong pb-3">

                        <div className="text-4xl">
                            👤
                        </div>

                        <h2 className="text-2xl font-bold uppercase text-text-primary">
                            Perfil de Usuario
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-2 gap-10">

                        <div className="flex flex-col items-center">

                            <div className="w-64 h-72 rounded-xl overflow-hidden border-4 border-panel shadow-md flex items-center justify-center bg-surface">

                                {user.userImage ? (
                                    <img
                                        src={getImageUrl(user.userImage)}
                                        alt={`Fotografía de ${user.userName}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <span className="text-7xl font-bold text-text-secondary uppercase">
                                        {user.userName?.trim().slice(0, 2)}
                                    </span>
                                )}

                            </div>

                            <h3 className="mt-5 text-xl font-bold text-text-primary">
                                {user.userName}
                            </h3>

                            <div className="w-full border-b border-border-strong my-5" />

                            <div className="flex items-center gap-3">

                                <span className="font-semibold text-text-primary">
                                    Estado
                                </span>

                                <StatusSwitch
                                    checked={user.status}
                                    onChange={handleStatusChange}
                                    disabled={!canDisableUser}
                                />

                            </div>

                            <div className="flex justify-center mt-8">

                                <div className={`relative ${!canUpdateUser ? "cursor-not-allowed" : ""}`}>

                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => navigate(`/UpdateUser/${id}`)}
                                        disabled={!canUpdateUser}
                                    >
                                        Editar
                                    </Button>

                                    {!canUpdateUser && (
                                        <div className="absolute inset-0 cursor-not-allowed" />
                                    )}

                                </div>

                            </div>

                        </div>

                        <div className="bg-panel rounded-2xl shadow-md p-8 text-text-primary">

                            <DetailItem
                                label="Tipo de documento"
                                value={user.documentType}
                            />

                            <DetailItem
                                label="Número de documento"
                                value={user.documentNumber}
                            />

                            <DetailItem
                                label="Tipo de usuario"
                                value={user.userType}
                            />

                            <DetailItem
                                label="Correo electrónico"
                                value={user.userEmail}
                            />

                            <DetailItem
                                label="Número telefónico"
                                value={user.userPhone}
                            />

                            <DetailItem
                                label="Fecha de registro"
                                value={user.startDate}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
