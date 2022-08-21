import BaseModel from 'src/db/models/baseModel';

describe('BaseModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findByIdParam success', async () => {
    const findByPk = jest
      .spyOn(BaseModel, 'findByPk')
      .mockResolvedValue({ id: 1 } as any);
    await BaseModel.findByIdParam({
      params: {
        id: '1',
      },
    } as any);

    expect(findByPk).toBeCalledTimes(1);
    expect(findByPk).toBeCalledWith(1);
  });

  test('findByIdParam with not found', async () => {
    const findByPk = jest.spyOn(BaseModel, 'findByPk').mockResolvedValue(null);
    try {
      await BaseModel.findByIdParam(
        {
          params: {
            id: '1',
          },
        } as any,
        'not-found' as any,
      );
    } catch (error) {
      expect(findByPk).toBeCalledTimes(1);
      expect(findByPk).toBeCalledWith(1);
      expect(error).toBe('not-found');
    }
  });

  test('findWithPaginationRequest with empty options', async () => {
    const findAndCountAll = jest
      .spyOn(BaseModel, 'findAndCountAll')
      .mockResolvedValue({
        rows: [],
        count: 0 as any,
      });
    await BaseModel.findWithPaginationRequest({
      query: {
        pageIndex: 1,
        countPerPage: 10,
      },
    } as any);

    expect(findAndCountAll).toBeCalledTimes(1);
    expect(findAndCountAll).toBeCalledWith({
      limit: 10,
      offset: 10,
    });
  });

  test('findWithPaginationRequest with options', async () => {
    const findAndCountAll = jest
      .spyOn(BaseModel, 'findAndCountAll')
      .mockResolvedValue({
        rows: [],
        count: 0 as any,
      });
    await BaseModel.findWithPaginationRequest(
      {
        query: {
          pageIndex: 1,
          countPerPage: 10,
        },
      } as any,
      {
        where: {
          id: 1,
        } as any,
      },
    );

    expect(findAndCountAll).toBeCalledTimes(1);
    expect(findAndCountAll).toBeCalledWith({
      where: {
        id: 1,
      },
      limit: 10,
      offset: 10,
    });
  });
});
