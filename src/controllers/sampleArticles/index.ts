import { Request, Response } from 'express';
import SampleArticle from 'src/db/models/sampleArticle';
import { SampleApiErrors } from 'src/errors';
import { toPaginationResBody } from 'src/utilities/apiUtil';

export async function getSampleArticles(
  req: Request<void, void, void, IPaginationReqQuery>,
  res: Response,
): Promise<Response> {
  const { count, rows } = await SampleArticle.findWithPaginationRequest(req);
  return res.status(200).json(toPaginationResBody(count, rows, req));
}

export async function deleteSampleArticle(
  req: Request<IIdParam>,
  res: Response,
): Promise<Response> {
  const sampleArticle = await SampleArticle.findByIdParam(
    req,
    SampleApiErrors.articleNotFound,
  );
  await sampleArticle.destroy();
  return res.sendStatus(200);
}

export async function updateSampleArticle(
  req: Request<IIdParam, any, IPutSampleArticleReqBody>,
  res: Response,
): Promise<Response> {
  const { title, content } = req.body;
  const sampleArticle = await SampleArticle.findByIdParam(
    req,
    SampleApiErrors.articleNotFound,
  );
  if (!!title && (await SampleArticle.isTitleExist(title, sampleArticle.id))) {
    throw SampleApiErrors.duplicateTitle;
  }

  await sampleArticle.update({
    ...(title !== undefined && {
      title,
    }),
    ...(content !== undefined && {
      content,
    }),
  });
  return res.sendStatus(200);
}

export async function createSampleArticle(
  req: Request<void, void, IPostSampleArticleReqBody>,
  res: Response,
): Promise<Response> {
  if (await SampleArticle.isTitleExist(req.body.title)) {
    throw SampleApiErrors.duplicateTitle;
  }
  await SampleArticle.createArticle(req.body);
  return res.sendStatus(201);
}
