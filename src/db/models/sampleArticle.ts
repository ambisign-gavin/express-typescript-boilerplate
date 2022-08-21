import { DataTypes, Optional, Op } from 'sequelize';
import sequelize from './sequelize';
import BaseModel from './baseModel';

interface SampleArticleAttributes {
  id: number;
  title: string;
  content: string;
}

interface SampleArticleCreationAttributes
  extends Optional<SampleArticleAttributes, 'id'> {}

export default class SampleArticle
  extends BaseModel<SampleArticleAttributes, SampleArticleCreationAttributes>
  implements SampleArticleAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async isTitleExist(
    title: string,
    excludeId?: number,
  ): Promise<boolean> {
    const existCount = await SampleArticle.count({
      where: {
        title,
        ...(excludeId !== undefined && {
          id: { [Op.ne]: excludeId },
        }),
      },
    });
    return existCount > 0;
  }

  public static async createArticle(payload: {
    title: string;
    content: string;
  }): Promise<SampleArticle> {
    const article = await SampleArticle.create({
      title: payload.title,
      content: payload.content,
    });
    return article;
  }
}

SampleArticle.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'sample_articles',
    sequelize,
    underscored: true,
  },
);
