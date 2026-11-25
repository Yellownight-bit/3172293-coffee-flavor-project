
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.resolve(__dirname, "../../uploads");

const storage = (folder) => {
    const destination = path.join(uploadsPath, folder);

    fs.mkdirSync(destination, { recursive: true });

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },

        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const filename = `${crypto.randomUUID()}${extension}`;

            cb(null, filename);
        },
    });
};

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de archivo no permitido"));
    }
};

const createUpload = (folder) =>
    multer({
        storage: storage(folder),
        fileFilter,
        limits: {
            fileSize: 10 * 1024 * 1024,
            files: 12,
        },
    });

export const uploadUsers = createUpload("users");
export const uploadSuppliers = createUpload("suppliers");
export const uploadProducts = createUpload("products");
export const uploadOrders = createUpload("orders");
export const uploadInventory = createUpload("inventory");
