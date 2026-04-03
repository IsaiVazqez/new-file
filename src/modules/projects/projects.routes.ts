import { Router } from 'express';
import multer from 'multer';
import * as controller from './projects.controller';
import { verifyToken } from '../auth/auth.middleware';

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Public
router.get('/published', controller.getPublished);

// Protected
router.get('/', verifyToken, controller.getAll);
router.get('/:id', verifyToken, controller.getById);
router.post('/', verifyToken, controller.create);
router.put('/:id', verifyToken, controller.update);
router.delete('/:id', verifyToken, controller.remove);
router.patch('/reorder', verifyToken, controller.reorder);
router.post('/upload-cover', verifyToken, upload.single('cover'), controller.uploadCover);

export default router;
