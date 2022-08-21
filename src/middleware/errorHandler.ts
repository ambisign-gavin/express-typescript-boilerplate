import { Response, Request } from 'express';
import { ApiError } from 'src/errors/apiError';
import logger from 'src/utilities/logger';

const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response<ErrorResponse>,
): Response<ErrorResponse> => {
  if (!(error instanceof ApiError)) {
    logger.error(`${req.originalUrl} [server-error]: ${error}`);
    error = ApiError.create();
  } else {
    logger.error(`${req.originalUrl} [api-error]: ${error}`);
  }
  return res.status(error.status).json({
    code: error.code,
    message: error.message,
  });
};

export default errorHandler;
