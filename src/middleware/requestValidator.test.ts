import { ValidationError } from 'yup';
import requestValidator from './requestValidator';

describe('requestValidator success', () => {
  const mockSchema = {
    validateSync: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validate default key', () => {
    requestValidator(mockSchema as any)(
      {
        body: {
          name: 'name',
        },
      } as any,
      {} as any,
      mockNext as any,
    );
    expect(mockSchema.validateSync).toBeCalledTimes(1);
    expect(mockSchema.validateSync).toBeCalledWith({ name: 'name' });
    expect(mockNext).toBeCalledTimes(1);
  });

  test('validate body', () => {
    requestValidator(mockSchema as any, 'body')(
      {
        body: {
          name: 'name',
        },
      } as any,
      {} as any,
      mockNext as any,
    );
    expect(mockSchema.validateSync).toBeCalledTimes(1);
    expect(mockSchema.validateSync).toBeCalledWith({ name: 'name' });
    expect(mockNext).toBeCalledTimes(1);
  });

  test('validate params', () => {
    requestValidator(mockSchema as any, 'params')(
      {
        params: {
          key: 'value',
        },
      } as any,
      {} as any,
      mockNext as any,
    );
    expect(mockSchema.validateSync).toBeCalledTimes(1);
    expect(mockSchema.validateSync).toBeCalledWith({ key: 'value' });
    expect(mockNext).toBeCalledTimes(1);
  });

  test('validate query', () => {
    requestValidator(mockSchema as any, 'query')(
      {
        query: {
          key: 'value',
        },
      } as any,
      {} as any,
      mockNext as any,
    );
    expect(mockSchema.validateSync).toBeCalledTimes(1);
    expect(mockSchema.validateSync).toBeCalledWith({ key: 'value' });
    expect(mockNext).toBeCalledTimes(1);
  });
});

describe('requestValidator error', () => {
  const mockSchema = {
    validateSync: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validate with ValidationError', () => {
    mockSchema.validateSync.mockImplementation(() => {
      throw new ValidationError('ValidationError');
    });
    requestValidator(mockSchema as any)({} as any, {} as any, mockNext as any);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith('ValidationError');
  });

  test('validate with ValidationErrors', () => {
    mockSchema.validateSync.mockImplementation(() => {
      throw new ValidationError([
        new ValidationError('ValidationError01'),
        new ValidationError('ValidationError02'),
      ]);
    });
    requestValidator(mockSchema as any)({} as any, {} as any, mockNext as any);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith('ValidationError01');
  });

  test('validate with Error', () => {
    mockSchema.validateSync.mockImplementation(() => {
      throw new Error('error');
    });
    requestValidator(mockSchema as any)({} as any, {} as any, mockNext as any);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(new Error('error'));
  });
});
