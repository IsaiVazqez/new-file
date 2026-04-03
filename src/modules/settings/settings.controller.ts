import { Request, Response, NextFunction } from 'express';
import * as service from './settings.service';
import { success } from '../../shared/response';

export function getAll(req: Request, res: Response, next: NextFunction): void {
  try {
    success(res, service.getAll());
  } catch (err) {
    next(err);
  }
}

export function getByKey(req: Request, res: Response, next: NextFunction): void {
  try {
    success(res, service.getByKey(req.params.key));
  } catch (err) {
    next(err);
  }
}

export function bulkUpdate(req: Request, res: Response, next: NextFunction): void {
  try {
    service.bulkUpdate(req.body.items);
    success(res, null);
  } catch (err) {
    next(err);
  }
}
