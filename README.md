# AI-powered Moderation Microservice

## Objective

Develop and deploy a microservice that scans user-generated content (comments and reviews) for inappropriate content and flag it for moderation. Assume that this is to be a part of a website or a social media platform where user’s comments and reviews are stored, passed through an AI endpoint and if flagged, stored separately for moderation.

## Requirements

- Implement a simple signup/login functionality for users. 
- Create endpoints for posting reviews and comments, and store users’ comments and reviews 
in a database. 
- Create endpoints to fetch a user’s comments, reviews and posts.   
- Use a pre-trained AI model endpoint to perform content moderation. 
(You’re free to choose any pre-deployed model endpoint that you like or a service like this) 
- Create the necessary frontend to allow a user to post comments and reviews on posts on your 
website. 
- If a comment or a review is flagged, store the comments and reviews flagged for each user for 
moderation. 
- Notify the user that their comment or review has been flagged for moderation.

## TechStack Used

- PERN (PostgreSQL, Express.js, React.js, Node.js) for Application Development.

- Vercel For Frontend Development.

- Docker containerization for easy access/testing.

- JWT Authentication.

- Postman API Collection provided.


## Deliverables

- Deployed Application Endpoint and API Collection

- Documentation (Notion Doc)

- Github Repository: https://github.com/shivchauhan795/AI-Moderation-Microservice


## Repository Structure

### Backend

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
### Frontend
```
frontend
|
|_ public
|    |_vite.svg
|_src
|  |
|  |_assets
|  |  |_Close.tsx
|  |  |_Comment.tsx
|  |  |_Like.tsx
|  |
|  |_pages
|  | |_Login.tsx
|  | |_Signup.ts
|  |
|  |_utils
|  | |_validator.tsx
|  |
|  |_App.tsx
|  |
|  |_index.css
|  |
|  |_main.tsx
|  |
|  |_ProtectedRoutes.tsx
|  |
|  |_SemiPublicRoutes.tsx
|  |
|  |_vite-env.d.ts
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
|_eslint.config.js
|
|_index.html
|
|_package-lock.json
|
|_package.json
|
|_README.md
|
|_tsconfig.app.json
|
|_tsconfig.json
|
|_tsconfig.node.json
|
|_vite.config.ts

```

## Contribution

To Contribute in each backend and frontend follow the `CONTRIBUTION.md` file present in the directory.

## Installation/Testing

Follow the `README.md` file present in each directory for installation/testing.