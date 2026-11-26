
import { userService } from "./user.service.js";

export const userController = {

    async create(req, res) {
        try {
            const userData = {
                ...req.body,
                userImage: req.files?.[0]
                    ? `/uploads/users/${req.files[0].filename}`
                    : null,
            };

            const user = await userService.createUser(userData);

            return res.status(201).json({
                message: "Usuario creado correctamente",
                userId: user.id,
            });

        } catch (err) {
            console.error("ERROR BACKEND:", err);

            return res.status(500).json({
                error: err.message,
            });
        }
    },

    async getAll(req, res) {
        try {
            const users = await userService.getAllUsers();

            return res.status(200).json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    },

    async getMyProfile(req, res) {
        try {
            const user = await userService.getMyProfile(req.user.id);

            if (!user) {
                return res.status(404).json({
                    error: "Usuario no encontrado",
                });
            }

            return res.status(200).json(user);

        } catch (error) {
            console.error("Error obteniendo el perfil:", error);

            return res.status(500).json({
                error: "Error obteniendo el perfil del usuario",
            });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            const updatedUser = await userService.updateUserStatus(id, is_active);

            return res.status(200).json({
                message: "Estado actualizado",
                user: updatedUser
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;

            const userData = {
                ...req.body,
            };

            if (req.files?.[0]) {
                userData.userImage = `/uploads/users/${req.files[0].filename}`;
            }

            console.log("DATOS RECIBIDOS PARA ACTUALIZAR:", userData);

            const updatedUser = await userService.updateUser(id, userData);

            if (!updatedUser) {
                return res.status(404).json({
                    error: "Usuario no encontrado",
                });
            }

            return res.status(200).json({
                message: "Usuario actualizado correctamente",
                user: updatedUser,
            });

        } catch (error) {
            console.error("ERROR AL ACTUALIZAR USUARIO:", error);

            return res.status(500).json({
                error: error.message,
            });
        }
    },

    async getUsersForPermissions(req, res) {
        try {
            const users = await userService.getUsersForPermissions();

            res.status(200).json(users);
        } catch (error) {
            console.error("Error obteniendo usuarios para permisos:", error);

            res.status(500).json({
                error: "Error obteniendo usuarios",
            });
        }
    },
};
