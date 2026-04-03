interface EnvConfig {
  PORT: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
}

const required: string[] = [
  'PORT',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

const missing: string[] = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables:\n  ${missing.join('\n  ')}\nCheck your .env file against .env.example`
  );
}

const env: EnvConfig = {
  PORT: process.env.PORT!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
};

export default env;
