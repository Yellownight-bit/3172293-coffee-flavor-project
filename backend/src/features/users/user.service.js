
import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";

export const userService = {

    async createUser(data) {

        const hashedPassword = await bcrypt.hash(data.userPassword, 10);

        const userData = {
            ...data,
            userPassword: hashedPassword,
        };

        return await userRepository.create(userData);
    },

    async getAllUsers() {
        const users = await userRepository.findAll();
        return users;
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

        const userData = {
            ...data,
            userPassword: hashedPassword,
        };

        return await userRepository.update(id, userData);
    },

    async getUsersForPermissions() {
        return await userRepository.getUsersForPermissions();
    },
};
