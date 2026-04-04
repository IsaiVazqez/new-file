import { Router } from 'express';
import multer from 'multer';
import * as controller from './images.controller';
import { verifyToken } from '../auth/auth.middleware';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const router: Router = Router();

router.get('/', controller.getByProject); // Public — needed for portfolio lightbox
router.post('/upload', verifyToken, upload.single('image'), controller.upload);
router.delete('/:id', verifyToken, controller.remove);
router.patch('/reorder', verifyToken, controller.reorder);

export default router;
