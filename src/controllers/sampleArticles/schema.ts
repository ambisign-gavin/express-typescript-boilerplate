import { SampleApiErrors } from 'src/errors';
import * as yup from 'yup';

export const PostSampleArticleSchema: yup.SchemaOf<IPostSampleArticleReqBody> =
  yup.object().shape({
    title: yup.string().required(() => SampleApiErrors.requiredTitle),
    content: yup
      .string()
      .required(() => SampleApiErrors.requiredContent)
      .min(5, () => SampleApiErrors.contentTooShort),
  });

export const PutSampleArticleSchema: yup.SchemaOf<IPutSampleArticleReqBody> =
  yup.object().shape({
    title: yup.string(),
    content: yup.string().min(5, () => SampleApiErrors.contentTooShort),
  });
