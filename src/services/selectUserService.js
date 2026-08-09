import { users } from "@/features/users/data/users.js";

export const getOrderUsers = async () => {
  return users.map((user) => ({
    value: user.id,
    label: user.userName,
  }));
};