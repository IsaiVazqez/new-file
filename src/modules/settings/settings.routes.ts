import { Router } from 'express';
import * as controller from './settings.controller';
import { verifyToken } from '../auth/auth.middleware';

const router: Router = Router();

// Public
router.get('/', controller.getAll);
router.get('/:key', controller.getByKey);

// Protected
router.put('/', verifyToken, controller.bulkUpdate);

export default router;
