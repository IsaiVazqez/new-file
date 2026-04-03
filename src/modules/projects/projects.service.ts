import * as repo from './projects.repository';
import { Project, ReorderItem } from './projects.repository';
import { AppError } from '../../shared/errors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const COVERS_DIR = path.join(__dirname, '..', '..', '..', 'uploads', 'covers');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function getAll(): Project[] {
  return repo.findAll();
}

export function getPublished(): Project[] {
  return repo.findPublished();
}

export function getPublishedPaginated(limit: number, offset: number) {
  return repo.findPublishedPaginated(limit, offset);
}

export function getById(id: number): Project {
  const project = repo.findById(id);
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export function create(data: Partial<Project>): Project | undefined {
  if (!data.title) throw new AppError('Title is required', 400);
  return repo.create(data);
}

export function update(id: number, data: Partial<Project>): Project | undefined {
  const existing = repo.findById(id);
  if (!existing) throw new AppError('Project not found', 404);
  if (!data.title) throw new AppError('Title is required', 400);
  return repo.update(id, data);
}

export function remove(id: number): void {
  const existing = repo.findById(id);
  if (!existing) throw new AppError('Project not found', 404);
  repo.remove(id);
}

export function reorder(items: ReorderItem[]): void {
  if (!Array.isArray(items)) throw new AppError('Items must be an array', 400);
  repo.reorder(items);
}

export function uploadCoverFile(file: Express.Multer.File): string {
  if (!file) throw new AppError('File is required', 400);
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new AppError('Solo se permiten archivos JPG, PNG o WebP', 400);
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new AppError('El archivo no puede superar 20MB', 400);
  }

  fs.mkdirSync(COVERS_DIR, { recursive: true });

  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  fs.writeFileSync(path.join(COVERS_DIR, filename), file.buffer);

  return `/uploads/covers/${filename}`;
}
