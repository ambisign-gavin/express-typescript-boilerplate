import { Op } from 'sequelize';
import SampleArticle from 'src/db/models/sampleArticle';

describe('SampleArticle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('isTitleExist without excludeId', async () => {
    const count = jest.spyOn(SampleArticle, 'count').mockResolvedValue(0);
    await SampleArticle.isTitleExist('title');

    expect(count).toBeCalledTimes(1);
    expect(count).toBeCalledWith({
      where: {
        title: 'title',
      },
    });
  });

  test('isTitleExist with excludeId', async () => {
    const count = jest.spyOn(SampleArticle, 'count').mockResolvedValue(0);
    await SampleArticle.isTitleExist('title', 1);

    expect(count).toBeCalledTimes(1);
    expect(count).toBeCalledWith({
      where: {
        title: 'title',
        id: {
          [Op.ne]: 1,
        },
      },
    });
  });

  test('createArticle', async () => {
    const create = jest.spyOn(SampleArticle, 'create').mockResolvedValue({
      title: 'title1',
      content: 'content1',
    });
    await SampleArticle.createArticle({
      title: 'title1',
      content: 'content1',
    });

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith({
      title: 'title1',
      content: 'content1',
    });
  });
});
