import { Request, Response, NextFunction } from 'express';
import * as service from './images.service';
import { success } from '../../shared/response';
import { AppError } from '../../shared/errors';

export function getByProject(req: Request, res: Response, next: NextFunction): void {
  try {
    const projectId = req.query.project_id;
    if (!projectId) throw new AppError('project_id query param is required', 400);
    success(res, service.getByProject(Number(projectId)));
  } catch (err) {
    next(err);
  }
}

export function upload(req: Request, res: Response, next: NextFunction): void {
  try {
    const projectId = req.body.project_id;
    if (!projectId) throw new AppError('project_id is required', 400);
    const image = service.upload(req.file as Express.Multer.File, Number(projectId));
    success(res, image, 201);
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
