
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export async function verifyMailer() {
    try {
        await transporter.verify();
        console.log("Conexión con Gmail establecida correctamente");
    } catch (error) {
        console.error("Error al conectar con Gmail:", error.message);
    }
}
