import { Request, Response, NextFunction } from 'express';
import * as service from './projects.service';
import { success } from '../../shared/response';
import { uploadCoverFile } from './projects.service';

export function getAll(_req: Request, res: Response, next: NextFunction): void {
  try {
    success(res, service.getAll());
  } catch (err) {
    next(err);
  }
}

export function getPublished(req: Request, res: Response, next: NextFunction): void {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    if (req.query.limit || req.query.offset) {
      const result = service.getPublishedPaginated(limit, offset);
      success(res, result);
    } else {
      success(res, service.getPublished());
    }
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    success(res, service.getById(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const project = service.create(req.body);
    success(res, project, 201);
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    success(res, service.update(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
}

export function remove(req: Request, res: Response, next: NextFunction): void {
  try {
    service.remove(Number(req.params.id));
    success(res, null);
  } catch (err) {
    next(err);
  }
}

export function reorder(req: Request, res: Response, next: NextFunction): void {
  try {
    service.reorder(req.body.items);
    success(res, null);
  } catch (err) {
    next(err);
  }
}

export function uploadCover(req: Request, res: Response, next: NextFunction): void {
  try {
    const url = uploadCoverFile(req.file as Express.Multer.File);
    success(res, { url }, 201);
  } catch (err) {
    next(err);
  }
}
