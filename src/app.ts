import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from './utilities/logger';
import errorHandler from './middleware/errorHandler';
import SampleArticlesRouter from 'src/routers/sampleArticles';
import { ApiError } from './errors/apiError';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1', SampleArticlesRouter);

app.get('/', (req: Request, res: Response) => {
  logger.info('hello there');
  return res.send('hello world!!');
});

app.use(
  '/docs/api',
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(path.resolve(__dirname, '../docs/api.yaml'))),
);

app.use((err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  errorHandler(err, req, res);
});

export default app;
