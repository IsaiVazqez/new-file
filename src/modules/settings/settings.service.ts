import * as repo from './settings.repository';
import { AppError } from '../../shared/errors';
import { Setting } from './settings.repository';

export function getAll(): Setting[] {
  return repo.findAll();
}

export function getByCategory(category: string): Setting[] {
  return repo.findByCategory(category);
}

export function getByKey(key: string): Setting {
  const setting = repo.findByKey(key);
  if (!setting) throw new AppError('Setting not found', 404);
  return setting;
}

export function update(key: string, value: string): void {
  const existing = repo.findByKey(key);
  if (!existing) throw new AppError('Setting not found', 404);
  repo.upsert(key, value);
}

export function bulkUpdate(items: { key: string; value: string }[]): void {
  if (!Array.isArray(items)) throw new AppError('Items must be an array', 400);
  repo.bulkUpdate(items);
}
