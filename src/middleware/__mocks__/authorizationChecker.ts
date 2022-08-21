import { Request, Response, NextFunction } from 'express';

const authorizationChecker = (
  req: Request<any, any, any, IPaginationReqQuery>,
  res: Response,
  next: NextFunction,
): void => {
  next();
};

export default authorizationChecker;
