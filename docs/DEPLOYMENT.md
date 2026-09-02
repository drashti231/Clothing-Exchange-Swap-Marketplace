# Deployment Guidelines

## Backend (Server)
1. Set up a MongoDB Atlas cluster.
2. Create a Cloudinary account for image hosting.
3. Set up hosting (e.g., Render, Railway, Heroku, or DigitalOcean).
4. Set the following environment variables in the host:
   - `PORT`:5000
   - `NODE_ENV`: production
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secure random string
   - `CLOUDINARY_CLOUD_NAME`: From Cloudinary
   - `CLOUDINARY_API_KEY`: From Cloudinary
   - `CLOUDINARY_API_SECRET`: From Cloudinary
   - `CLIENT_URL`: URL of the deployed frontend
5. Deploy the `server` directory.

## Frontend (Client)
1. Set up hosting (e.g., Vercel, Netlify).
2. Set the environment variable:
   - `VITE_API_URL`: URL of the deployed backend
3. Build the frontend using `npm run build`.
4. Deploy the `dist` directory.
