import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from './auth.controller';

const router: Router = Router();

const isProd = process.env.NODE_ENV === 'production';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 10 : 500,
  message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
});

router.post('/login', loginLimiter, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);

export default router;
