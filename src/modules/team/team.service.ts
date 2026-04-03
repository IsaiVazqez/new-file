import * as repo from './team.repository';
import { AppError } from '../../shared/errors';
import { TeamMember, ReorderItem } from './team.repository';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const PHOTOS_DIR = path.join(__dirname, '..', '..', '..', 'uploads', 'team');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function getAll(): TeamMember[] {
  return repo.findAll();
}

export function getActive(): TeamMember[] {
  return repo.findActive();
}

export function getById(id: number): TeamMember {
  const member = repo.findById(id);
  if (!member) throw new AppError('Team member not found', 404);
  return member;
}

export function create(data: Partial<TeamMember> & { name: string }): TeamMember | undefined {
  if (!data.name) throw new AppError('Name is required', 400);
  return repo.create(data);
}

export function update(id: number, data: Partial<TeamMember> & { name: string }): TeamMember | undefined {
  const existing = repo.findById(id);
  if (!existing) throw new AppError('Team member not found', 404);
  if (!data.name) throw new AppError('Name is required', 400);
  return repo.update(id, data);
}

export function remove(id: number): void {
  const existing = repo.findById(id);
  if (!existing) throw new AppError('Team member not found', 404);
  repo.remove(id);
}

export function reorder(items: ReorderItem[]): void {
  if (!Array.isArray(items)) throw new AppError('Items must be an array', 400);
  repo.reorder(items);
}

export function uploadPhoto(file: Express.Multer.File): string {
  if (!file) throw new AppError('File is required', 400);
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new AppError('Solo se permiten archivos JPG, PNG o WebP', 400);
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new AppError('El archivo no puede superar 20MB', 400);
  }

  fs.mkdirSync(PHOTOS_DIR, { recursive: true });

  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  fs.writeFileSync(path.join(PHOTOS_DIR, filename), file.buffer);

  return `/uploads/team/${filename}`;
}
