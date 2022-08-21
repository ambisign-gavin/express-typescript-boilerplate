# Express boilerplate

A boilerplate project for quickly building an Express server,supports Sequelize, TypeScript and hot reload.

* [Features](#Features)
* [Getting Started](#GettingStarted)
* [Project Structure](#structure)
* [Environment variables](#env)
* [Error handling and created](#error)
* [Validation](#Validation)
* [Logging](#Logging)
* [Sequelize enhance model](#Sequelize)
* [API Documentation](#APIDocumentation)

## Features<a id="Features"></a>

* **MySQL**: using [Sequelize v6](https://sequelize.org/docs/v6/) and support the enhance BaseModel.

* **Validation**: request data validation using [yup](https://github.com/jquense/yup).

* **Logging**: using [winston](https://github.com/winstonjs/winston) and support `daily-rotate`.

* **Environment variables**: using [dotenv](https://www.npmjs.com/package/dotenv).

* **API documentation**: using [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) to serve the API documentation.

* **Testing**: unit and integration tests using [Jest](https://jestjs.io/).

* **Error handling and created**: centralized error handling by middleware and use of the ApiError class centralized create the error object.

* **CORS**: CORS is supported.

* **Linting**: with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/).

* **TypeScript**: TypeScript is supported.

* **Hot reload**: Hot reload is supported.

## Getting Started<a id="GettingStarted"></a>

1. clone the repo:

```
git clone --depth 1 git@github.com:ambisign-gavin/express-typescript-boilerplate.git
cd express-typescript-boilerplate
rm -rf .git
```

2. run the initial environment and databaes config command: 

```
npm run initenv
```

3. setting the environment variables:
  
  * database config path: `src/db/config/`.

  * server env file path: `./.env-rc.json`.

4. start the server on development mode:

```
npm run dev
```

## Project Structure<a id="structure" ></a>

```
docs\                       # swagger API folder
src\
  |-- controllers\          # Route controllers
  |-- routers\              # Routes
  |-- db\                   # Sequelize related things
      |-- config\           # Database config
      |-- migrations\       # Database migrations
      |-- models\           # Database models
           |-- baseModel.ts   # Support enhance functions, other models can extend this.
  |-- errors\
       |-- apiError.ts      
  |-- middleware\
       |-- requestValidator.ts   # Validate the request, use yup.
  |-- utilities\
       |-- logger.ts   #logger tool, use winston
       |-- apiUtil.ts
  |-- app.ts
  |-- index.ts
.env   # Environment variables
```

## Environment variables<a id='env'></a>

The environment variables can be set in the `.env`.

## Error handling and created<a id="error"></a>

Using the middleware to handle the error, you just need to wrap the controller by using the `handleError` util.


```
import { handleError } from 'src/utilities/apiUtil';

UserRouter
  .route('/users')
  .post(
    handleError(controller.createUser),
  );

```

You can use the ApiError to create the error.

```
export const UserApiErrors = {
  resourceNotFound: ApiError.create({
    status: 404,
    code: 404001,
    message: 'the user not found',
  }),
```

## Validation

Request data is validated using yup. Check the documentation for more details on how to write yup validation schemas.

You can specified the request data you want to validate, like `params`, `query` an `body`.

```

UserRouter
  .route('/users/:id')
  .put(
    requestValidator(IdParamsSchema, 'params'),
    requestValidator(PutUserBodySchema, 'body'),
    handleError(controller.updateUser),
  );

```

## Logging<a id="Logging"></a>

Import the logger util from `src/utilities/logger`. 

## Sequelize enhance model<a id="Sequelize"></a>

The BaseModel class supports some enhance function, has the `findByIdParam` and `findWithPaginationRequest` for now.

You can just create a new model and extends the BaseMode.
```
class User
  extends BaseModel<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  ...
}
```

## API Documentation<a id='APIDocumentation'></a>

The API Documentation URL is http://localhost:3000/docs/api.