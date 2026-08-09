import { z } from "zod";
import { fileSchema } from "@/shared/schemas/fileSchema";

export const inventorySchema = z.object({
  productName: z
    .string()
    .min(2, "El nombre del producto debe tener mínimo 2 caracteres")
    .max(60, "El nombre del producto es demasiado largo"),

  productId: z
    .string()
    .min(1, "Debe ingresar el ID del producto"),

  productQuantity: z
    .string()
    .regex(
      /^[0-9]+$/,
      "La cantidad debe contener únicamente números"
    )
    .refine(
      (value) => Number(value) > 0,
      "La cantidad debe ser mayor a 0"
    ),

  productSupplierNames: z
    .string()
    .min(1, "Debe seleccionar un proveedor"),

  productSupplierNit: z
    .string()
    .min(5, "El NIT del proveedor es inválido")
    .max(20, "El NIT del proveedor es demasiado largo"),

  productDescription: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  productPrice: z
    .string()
    .regex(
      /^[0-9]+$/,
      "El precio debe contener únicamente números"
    )
    .refine(
      (value) => Number(value) > 0,
      "El precio debe ser mayor a 0"
    ),

  productEntryDate: z
    .string()
    .min(1, "Debe ingresar la fecha de ingreso"),

  productImage: fileSchema.shape.files.optional(),

  isStaff: z.boolean(),

  isActive: z.boolean(),
});