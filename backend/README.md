# AI-powered Moderation Microservice (Backend)

- Backend `Express.js` Code is written in `typescript`.

- Zod validation is used for validating input data while login and signup.

- Token based authentication is used.

- Backend has a well structured file structure where the code is written in a clean way so that any new developer will start contributing from day 1.

- Prisma ORM is used with Postgres db for a clean and efficient development process.


## Testing

### Manual Testing

1. Clone the repository: https://github.com/shivchauhan795/AI-Moderation-Microservice

2. Move into Backend Directory: `cd backend`.

3. Install Dependencies: `npm install`

4. Create `.env` file similar to `.env.example` file.

5. Generate prisma client: `npx prisma generate`.

6. Migrate the prisma schema to the db: `npx prisma migrate dev`.

7. Start the project in development mode: `npm run dev`.

8. Check the backend on: `http://localhost:3000`.

### Testing via Docker

1. Run this command on terminal: `docker run -e DATABASE_URL="database_url" -e MODERATION_KEY="moderation_key" -e JWT_SECRET="jwt_secret" -p 3000:3000 shivchauhan/ai-moderator-backend`

2. Check the frontend on: `http://localhost:3000`.


## APIs

1. Signup
2. Login
3. Create Post
4. Create Comment
5. Like Post
6. Get All Post
7. Get Flagged Comments

## Moderation API

WebPurify API is used for comment moderation.

Link of the API: https://www.webpurify.com/

## Working

### Signup/Login

- Signup and login are handled natively.
- Zod validations are setup to have a validated data that will be stored in the db.
- Bcrypt is used for hashing password and comparing the password at the time of login.
- JWT token is used to sign and verify the token.


### Other APIs

- Other apis are implemented in abasic fashion.
- Content is verified when the comment is posted through web purify api.
- Whenever the api is flagged as moderate then we add a boolean value true in the comments table in the specific comment.

### Middleware

- Middleware takes care of thee authenticity.
- It ensures that only authenticated user can access the endpoints.
- Each endpoint is protected by the middleware which takes token and verify the authenticity.

## Structure of Backend

```
backend
|
|_ api
|    |_controllers
|    |  |_authController.ts
|    |  |_userController.ts
|    |
|    |_middleware
|    |  |_authMiddleware.ts
|    |
|    |_moderator
|    | |_moderator.ts
|    |
|    |_routes
|    | |_authRoutes.ts
|    | |_userRoutes.ts
|    |
|    |_validator
|    | |_validator.ts
|    |
|    |_index.ts
|
|_prisma
| |_migration
| |
| |_schema.prisma
|
|_.dockerignore
|
|_.env.example
|
|_.gitignore
|
|_CONTRIBUTION.md
|
|_Dockerfile
|
|_package-lock.json
|
|_package.json
|
|_tsconfig.json
|
|_tsconfig.tsbuildinfo

```