import { Router } from 'express';
import authorizationChecker from 'src/middleware/authorizationChecker';
import * as controller from 'src/controllers/sampleArticles';
import requestValidator from 'src/middleware/requestValidator';
import { IdParamSchema, PaginationQuerySchema } from 'src/controllers/schema';
import {
  PostSampleArticleSchema,
  PutSampleArticleSchema,
} from 'src/controllers/sampleArticles/schema';
import { handleError } from 'src/utilities/apiUtil';
const SampleArticlesRouter = Router();

const adminRouter = Router();
adminRouter.use(authorizationChecker);
adminRouter
  .route('/sampleArticles')
  .post(
    requestValidator(PostSampleArticleSchema),
    handleError(controller.createSampleArticle),
  );
adminRouter
  .route('/sampleArticles/:id')
  .all(requestValidator(IdParamSchema, 'params'))
  .put(
    requestValidator(PutSampleArticleSchema),
    handleError(controller.updateSampleArticle),
  )
  .delete(handleError(controller.deleteSampleArticle));

const standardRouter = Router();
standardRouter
  .route('/sampleArticles')
  .get(
    requestValidator(PaginationQuerySchema, 'query'),
    handleError(controller.getSampleArticles),
  );

SampleArticlesRouter.use('/admin', adminRouter);
SampleArticlesRouter.use('', standardRouter);

export default SampleArticlesRouter;
