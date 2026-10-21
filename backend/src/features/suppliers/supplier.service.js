import bcrypt from "bcrypt";
import { supplierRepository } from "./supplier.repository.js";

export const supplierService = {
  async createSupplier(data) {
    const hashedPassword = await bcrypt.hash(data.supplierPassword, 10);

    const supplierData = {
      ...data,
      supplierPassword: hashedPassword,
    };

    return await supplierRepository.create(supplierData);
  },
};
