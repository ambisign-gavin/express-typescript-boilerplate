import app from 'src/app';
import SampleArticle from 'src/db/models/sampleArticle';
import request from 'supertest';

jest.mock('src/db/models/sampleArticle');
jest.mock('src/middleware/authorizationChecker');
jest.mock('src/utilities/logger');

describe('GET /v1/sampleArticles', () => {
  test('success', async () => {
    const findWithPaginationRequest = jest
      .spyOn(SampleArticle, 'findWithPaginationRequest')
      .mockResolvedValue({
        count: 2 as any,
        rows: [
          {
            id: 1,
            title: '1',
            content: '`',
          },
          {
            id: 1,
            title: '2',
            content: '2',
          },
        ] as any,
      });
    const res = await request(app)
      .get('/v1/sampleArticles?pageIndex=0&countPerPage=10')
      .send();
    expect(res.statusCode).toBe(200);
    expect(findWithPaginationRequest).toBeCalledTimes(1);
    expect(findWithPaginationRequest.mock.calls[0][0].query).toStrictEqual({
      pageIndex: '0',
      countPerPage: '10',
    });
    expect(res.body).toStrictEqual({
      countPerPage: 10,
      currentPageIndex: 0,
      totalPage: 1,
      totalCount: 2,
      records: [
        {
          id: 1,
          title: '1',
          content: '`',
        },
        {
          id: 1,
          title: '2',
          content: '2',
        },
      ],
    });
  });
});

describe('POST /v1/admin/sampleArticles', () => {
  test('success', async () => {
    const createArticleMock = jest.spyOn(SampleArticle, 'createArticle');
    const res = await request(app).post('/v1/admin/sampleArticles').send({
      title: 'title',
      content: 'content',
    });
    expect(res.statusCode).toBe(201);
    expect(createArticleMock).toBeCalledTimes(1);
    expect(createArticleMock).toHaveBeenCalledWith({
      title: 'title',
      content: 'content',
    });
  });

  test('duplicate title', async () => {
    const isTitleExistMock = jest
      .spyOn(SampleArticle, 'isTitleExist')
      .mockImplementationOnce(() => Promise.resolve(true));

    const res = await request(app).post('/v1/admin/sampleArticles').send({
      title: 'title',
      content: 'content',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      code: 400105,
      message: 'duplicate title',
    });
    expect(isTitleExistMock).toHaveBeenCalledWith('title');
  });

  test('content empty', async () => {
    const res = await request(app).post('/v1/admin/sampleArticles').send({
      title: 'title',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      code: 400102,
      message: 'content is a required field',
    });
  });

  test('content too short', async () => {
    const res = await request(app).post('/v1/admin/sampleArticles').send({
      title: 'title',
      content: 'c',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      code: 400101,
      message: 'content must be at least 5 characters',
    });
  });

  test('title empty', async () => {
    const res = await request(app).post('/v1/admin/sampleArticles').send({
      content: 'content',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      code: 400100,
      message: 'title is a required field',
    });
  });
});

describe('PUT /v1/admin/sampleArticles/:id', () => {
  const mockModel = { id: 1, update: jest.fn() };

  beforeEach(() => {
    jest
      .spyOn(SampleArticle, 'findByIdParam')
      .mockResolvedValue(mockModel as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('update content success', async () => {
    const res = await request(app).put('/v1/admin/sampleArticles/1').send({
      content: 'content 01',
    });

    expect(res.statusCode).toBe(200);
    expect(mockModel.update).toBeCalledTimes(1);
    expect(mockModel.update).toBeCalledWith({
      content: 'content 01',
    });
  });

  test('update title success', async () => {
    const res = await request(app).put('/v1/admin/sampleArticles/1').send({
      title: 'title 01',
    });

    expect(res.statusCode).toBe(200);
    expect(mockModel.update).toBeCalledTimes(1);
    expect(mockModel.update).toBeCalledWith({
      title: 'title 01',
    });
  });

  test('article not found', async () => {
    jest
      .spyOn(SampleArticle, 'findByIdParam')
      .mockImplementation((req: any, error: any) => {
        throw error;
      });
    const res = await request(app).put('/v1/admin/sampleArticles/1').send({
      content: 'content 01',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      code: 404101,
      message: 'the article not found',
    });
  });

  test('update with duplicate title', async () => {
    const isTitleExistMock = jest
      .spyOn(SampleArticle, 'isTitleExist')
      .mockResolvedValueOnce(true);

    const res = await request(app).put('/v1/admin/sampleArticles/1').send({
      title: 'title 01',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      code: 400105,
      message: 'duplicate title',
    });
    expect(isTitleExistMock).toBeCalledWith('title 01', 1);
  });

  test('update with content too short', async () => {
    const res = await request(app).put('/v1/admin/sampleArticles/1').send({
      content: 'c',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      code: 400101,
      message: 'content must be at least 5 characters',
    });
  });
});

describe('DELETE /v1/admin/sampleArticles/:id', () => {
  const mockModel = { destroy: jest.fn() };

  beforeEach(() => {
    jest
      .spyOn(SampleArticle, 'findByIdParam')
      .mockResolvedValue(mockModel as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('success', async () => {
    const res = await request(app).delete('/v1/admin/sampleArticles/1').send();
    expect(res.statusCode).toBe(200);
    expect(mockModel.destroy).toBeCalledTimes(1);
  });

  test('article not found', async () => {
    jest
      .spyOn(SampleArticle, 'findByIdParam')
      .mockImplementation((req: any, error: any) => {
        throw error;
      });
    const res = await request(app).delete('/v1/admin/sampleArticles/1').send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      code: 404101,
      message: 'the article not found',
    });
    expect(mockModel.destroy).toBeCalledTimes(0);
  });
});
