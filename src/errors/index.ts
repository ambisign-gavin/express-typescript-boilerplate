import { ApiError } from './apiError';

export const DefaultApiErrors = {
  mustBeANumber: (column: string): ApiError =>
    ApiError.create({
      status: 400,
      code: 400000,
      message: `${column} must be a number type.`,
    }),
  resourceNotFound: ApiError.create({
    status: 404,
    code: 404001,
    message: 'the resource not found',
  }),
};

export const SampleApiErrors = {
  requiredTitle: ApiError.create({
    status: 400,
    code: 400100,
    message: 'title is a required field',
  }),
  contentTooShort: ApiError.create({
    status: 400,
    code: 400101,
    message: 'content must be at least 5 characters',
  }),
  requiredContent: ApiError.create({
    status: 400,
    code: 400102,
    message: 'content is a required field',
  }),
  duplicateTitle: ApiError.create({
    status: 400,
    code: 400105,
    message: 'duplicate title',
  }),
  articleNotFound: ApiError.create({
    status: 404,
    code: 404101,
    message: 'the article not found',
  }),
};
