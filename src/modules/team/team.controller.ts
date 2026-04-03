import { Request, Response, NextFunction } from 'express';
import * as service from './team.service';
import { success } from '../../shared/response';

export function getAll(req: Request, res: Response, next: NextFunction): void {
  try {
    const active = req.query.active;
    success(res, active === 'true' ? service.getActive() : service.getAll());
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
    success(res, service.create(req.body), 201);
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

export function uploadPhoto(req: Request, res: Response, next: NextFunction): void {
  try {
    const url = service.uploadPhoto(req.file as Express.Multer.File);
    success(res, { url }, 201);
  } catch (err) {
    next(err);
  }
}
