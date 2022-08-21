import { ApiError } from './apiError';

describe('ApiError', () => {
  test('create error', () => {
    const error = ApiError.create({
      status: 400,
      code: 4001,
      message: 'bad request',
    });
    expect(error.code).toBe(4001);
    expect(error.status).toBe(400);
    expect(error.message).toBe('bad request');
  });

  test('create default error', () => {
    const error = ApiError.create();
    expect(error.code).toBe(500000);
    expect(error.status).toBe(500);
    expect(error.message).toBe('unknow error');
  });
});
