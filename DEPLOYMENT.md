# Vercel deployment

## Frontend

- Vercel project root: `Client_Vastra/Ellegancesuit`
- Build command: `npm run build`
- Output directory: `build`
- The API base defaults to `https://vastrabackend-mauve.vercel.app/api/v1`. If configuring `REACT_APP_API_URL` in Vercel, use that exact value.

## Backend

- Vercel project root: `Auth_backend/Backend`
- Deploy using the included `vercel.json`.
- Set `FRONTEND_URL` to `https://vastrafrontend.vercel.app` for Google sign-in redirects and email links.
- Configure the backend's database, JWT, email, and Cloudinary environment variables in Vercel. Local `.env` values are not copied automatically.
- The backend CORS allowlist includes `https://vastrafrontend.vercel.app`.
