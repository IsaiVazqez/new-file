import { Response } from 'express';

function success(res: Response, data: any = null, statusCode: number = 200): void {
  res.status(statusCode).json({ success: true, data });
}

export { success };
