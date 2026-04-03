import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import * as repo from './images.repository';
import { AppError } from '../../shared/errors';
import { Image, ReorderItem } from './images.repository';

const ALLOWED_TYPES: string[] = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE: number = 20 * 1024 * 1024; // 20MB
const UPLOADS_ROOT: string = path.join(__dirname, '..', '..', '..', 'uploads');

export function getByProject(projectId: number): Image[] {
  return repo.findByProject(projectId);
}

export function upload(file: Express.Multer.File, projectId: number): Image | undefined {
  if (!file) throw new AppError('File is required', 400);
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new AppError('Only JPG, PNG, and WebP images are allowed', 400);
  }
  if (file.size > MAX_SIZE) {
    throw new AppError('File exceeds 20MB limit', 400);
  }

  // Create directory: uploads/<projectId>/
  const projectDir: string = path.join(UPLOADS_ROOT, String(projectId));
  fs.mkdirSync(projectDir, { recursive: true });

  const ext: string = path.extname(file.originalname);
  const filename: string = `${uuidv4()}${ext}`;
  const filePath: string = path.join(projectDir, filename);

  // Write file to disk
  fs.writeFileSync(filePath, file.buffer);

  // Store relative URL path (served as static by Express)
  const url: string = `/uploads/${projectId}/${filename}`;

  return repo.create({
    project_id: projectId,
    url,
    filename: `${projectId}/${filename}`,
    size_bytes: file.size,
    sort_order: 0,
  });
}

export function remove(id: number): void {
  const image = repo.findById(id);
  if (!image) throw new AppError('Image not found', 404);

  // Delete file from disk
  const filePath: string = path.join(UPLOADS_ROOT, image.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  repo.remove(id);
}

export function reorder(items: ReorderItem[]): void {
  if (!Array.isArray(items)) throw new AppError('Items must be an array', 400);
  repo.reorder(items);
}
