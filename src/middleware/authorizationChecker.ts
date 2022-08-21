import { Request, Response, NextFunction } from 'express';

const authorizationChecker = (
  req: Request<any, any, any, IPaginationReqQuery>,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    next(error);
  }
};

export default authorizationChecker;
