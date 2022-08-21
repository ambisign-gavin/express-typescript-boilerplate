import { handleError, toPaginationResBody } from './apiUtil';

describe('toPaginationResBody', () => {
  test('empty content', () => {
    const result = toPaginationResBody(0, [], {
      query: { pageIndex: 0, countPerPage: 10 },
    } as any);
    expect(result).toStrictEqual({
      countPerPage: 10,
      currentPageIndex: 0,
      totalPage: 0,
      totalCount: 0,
      records: [],
    });
  });

  test('has content', () => {
    const result = toPaginationResBody(8, [{ key: 11 }, { key: 12 }], {
      query: { pageIndex: 1, countPerPage: 6 },
    } as any);
    expect(result).toStrictEqual({
      countPerPage: 6,
      currentPageIndex: 1,
      totalPage: 2,
      totalCount: 8,
      records: [{ key: 11 }, { key: 12 }],
    });
  });

  test('calcuate totalPage, totalCount === countPerPage ', () => {
    const result = toPaginationResBody(2, [{ key: 11 }, { key: 12 }], {
      query: { pageIndex: 0, countPerPage: 2 },
    } as any);
    expect(result).toStrictEqual({
      countPerPage: 2,
      currentPageIndex: 0,
      totalPage: 1,
      totalCount: 2,
      records: [{ key: 11 }, { key: 12 }],
    });
  });

  test('calcuate totalPage, totalCount < countPerPage ', () => {
    const result = toPaginationResBody(2, [{ key: 11 }, { key: 12 }], {
      query: { pageIndex: 0, countPerPage: 3 },
    } as any);
    expect(result).toStrictEqual({
      countPerPage: 3,
      currentPageIndex: 0,
      totalPage: 1,
      totalCount: 2,
      records: [{ key: 11 }, { key: 12 }],
    });
  });

  test('calcuate totalPage, totalCount > countPerPage ', () => {
    const result = toPaginationResBody(
      4,
      [{ key: 11 }, { key: 12 }, { key: 13 }, { key: 14 }],
      {
        query: { pageIndex: 0, countPerPage: 1 },
      } as any,
    );
    expect(result).toStrictEqual({
      countPerPage: 1,
      currentPageIndex: 0,
      totalPage: 4,
      totalCount: 4,
      records: [{ key: 11 }, { key: 12 }, { key: 13 }, { key: 14 }],
    });
  });
});

describe('handleError', () => {
  test('throw error', () => {
    const mockNext = jest.fn();
    handleError(() => {
      throw 'error';
    })({} as any, {} as any, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith('error');
  });

  test('success', async () => {
    const mockNext = jest.fn();
    const result = await handleError(() => {
      return 'success';
    })({} as any, {} as any, mockNext);
    expect(mockNext).toBeCalledTimes(0);
    expect(result).toBe('success');
  });
});
