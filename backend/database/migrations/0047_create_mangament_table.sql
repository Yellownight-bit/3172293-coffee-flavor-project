CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    support_email VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id)
);

INSERT INTO system_settings (support_email)
VALUES ('soporte@coffeeflavor.com');