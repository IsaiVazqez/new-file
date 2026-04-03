import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import env from './src/config/env';
import { runMigrations } from './src/config/database';
import { errorHandler } from './src/shared/errors';
import authRoutes from './src/modules/auth/auth.routes';
import projectsRoutes from './src/modules/projects/projects.routes';
import imagesRoutes from './src/modules/images/images.routes';
import servicesRoutes from './src/modules/services/services.routes';
import settingsRoutes from './src/modules/settings/settings.routes';
import teamRoutes from './src/modules/team/team.routes';
import { seedAdmin } from './src/modules/auth/auth.service';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global rate limit (disabled in dev/test)
const skipRateLimit = process.env.NODE_ENV === 'test' || process.env.NODE_ENV !== 'production';
if (!skipRateLimit) {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

// --- Static files ---
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/images', imagesRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/team', teamRoutes);

// --- Error handler ---
app.use(errorHandler);

// --- Start ---
(async () => {
  runMigrations();
  console.log('Database migrations complete.');

  await seedAdmin();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
})();
