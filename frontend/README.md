# AI-powered Moderation Microservice (Frontend)

- Frontend `React.js` Code is written in `typescript` with `tailwindCSS`.

- Zod validation is used for validating input data while login and signup.

- Token based authentication and tokens are stored in localstorage.

- Assets folder contain few assets: Like, Comment, Close that are basically icons in the form of components for better representation and a clean look.

- `ProtectedRoutes.tsx` takes care that only authenticated users will be able to access the routes under  this route.

- `SemiProtectedRoutes.tsx` takes care that once loggedin authenticated users will no longer access the routes under this route.

## Testing

### Manual Testing

1. Clone the repository: https://github.com/shivchauhan795/AI-Moderation-Microservice

2. Move into Frontend Directory: `cd frontend`.

3. Install Dependencies: `npm install`

4. Create `.env` file similar to `.env.example` file.

5. Start the project in development mode: `npm run dev`.

6. Check the frontend on: `http://localhost:5173`.

### Testing via Docker

1. Run this command on terminal: `docker run -e VITE_BACKEND_URL='http://localhost:3000' -p 5173:5173 shivchauhan/ai-moderator`

2. Check the frontend on: `http://localhost:5173`.


## Working

### Login/Signup/Logout

- Created basic form for login and signup.

- Login form accepts `email` and `password`.

- Signup form accepts `name`, `email` and `password`.

- `fetch` request send the request to backend server and accordingly signup/login are performed.

- After login the token send from backend server is stored in localstorage.

- Token is created via jwt to can only be verified by the secret key stored safely in .env file.

- Logout button will be shown on the main page on top right side ones loggedin. Clicking on logout button will remove the token from the localstorage.

### Posts

- `App.tsx` contain the main code of the frontend.
- Each posts are shown in the form of card.
- Like and comment features are provided for each post.
- Each post have author name on top left of each post.
- Then content in the center of the card.
- Like and comment button on bottom center of each posts.
- On click on comment button a dialogbox open which will show the comments(if present) for the post and you can add comment from there.
- Each comment will be gone through AI Moderation and if it fails that means it contain the words that are offensive in any way.
- Those comments which are offensive will be flagged for moderation and will not be showing the actual content, instead shows "This comment is flagged for moderation!".
- Create post button on top right of the screen provides the feature of creating a new post.
- On click of create post button a dialog box open and there we can add the content for the post.


## Structure of Frontend

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