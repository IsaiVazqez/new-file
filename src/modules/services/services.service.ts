import * as repo from './services.repository';
import { AppError } from '../../shared/errors';
import { Service, ReorderItem } from './services.repository';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const SERVICES_DIR = path.join(__dirname, '..', '..', '..', 'uploads', 'services');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function getAll(): Service[] {
  return repo.findAll();
}

export function getActive(): Service[] {
  return repo.findActive();
}

export function getById(id: number): Service {
  const service = repo.findById(id);
  if (!service) throw new AppError('Service not found', 404);
  return service;
}

export function create(data: Partial<Service> & { title: string }): Service | undefined {
  if (!data.title) throw new AppError('Title is required', 400);
  return repo.create(data);
}

export function update(id: number, data: Partial<Service> & { title: string }): Service | undefined {
  const existing = repo.findById(id);
  if (!existing) throw new AppError('Service not found', 404);
  if (!data.title) throw new AppError('Title is required', 400);
  return repo.update(id, data);
}

export function remove(id: number): void {
  const existing = repo.findById(id);
  if (!existing) throw new AppError('Service not found', 404);
  repo.remove(id);
}

export function reorder(items: ReorderItem[]): void {
  if (!Array.isArray(items)) throw new AppError('Items must be an array', 400);
  repo.reorder(items);
}

export function uploadImage(file: Express.Multer.File): string {
  if (!file) throw new AppError('File is required', 400);
  if (!ALLOWED_TYPES.includes(file.mimetype)) throw new AppError('Solo JPG, PNG o WebP', 400);
  fs.mkdirSync(SERVICES_DIR, { recursive: true });
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  fs.writeFileSync(path.join(SERVICES_DIR, filename), file.buffer);
  return `/uploads/services/${filename}`;
}
