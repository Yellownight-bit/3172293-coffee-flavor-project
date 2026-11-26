
import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";

export const userService = {

    async createUser(data) {

        const acceptedDataPolicy =
            data.acceptedDataPolicy === true ||
            data.acceptedDataPolicy === "true";

        if (!acceptedDataPolicy) {
            throw new Error(
                "Debes aceptar la política de tratamiento de datos personales."
            );
        }

        const hashedPassword = await bcrypt.hash(data.userPassword, 10);

        const userData = {
            ...data,
            acceptedDataPolicy,
            userPassword: hashedPassword,
        };

        return await userRepository.create(userData);
    },

    async getAllUsers() {
        const users = await userRepository.findAll();
        return users;
    },

    async getMyProfile(id) {
        return await userRepository.findProfileById(id);
    },

    async updateUserStatus(id, is_active) {
        const updated = await userRepository.updateStatus(id, is_active);
        return updated;
    },

    async updateUser(id, data) {

        let hashedPassword = null;

        if (
            data.userPassword &&
            data.userPassword.trim() !== ""
        ) {
            hashedPassword = await bcrypt.hash(data.userPassword, 10);
        }

        const acceptedDataPolicy =
            data.acceptedDataPolicy === true ||
            data.acceptedDataPolicy === "true";

        const userData = {
            ...data,
            acceptedDataPolicy,
            userPassword: hashedPassword,
        };

        return await userRepository.update(id, userData);
    },

    async getUsersForPermissions() {
        return await userRepository.getUsersForPermissions();
    },
};
