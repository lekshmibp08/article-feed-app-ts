# React + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Article Feeds Web Application 📰

## Overview

This is a **MERN stack** web application that allows users to read, create, and manage articles based on their preferred categories such as Sports, Politics, and Space.

## Features

- User authentication (Signup & Login)
- Users can select preferred article categories
- Create, edit, and delete articles
- Like, dislike, and block articles
- View articles based on user preferences
- User dashboard to manage preferences
- Secure API with JWT authentication
- Image upload support for articles

## Backend Modules

-express - Web framework
-mongoose - MongoDB ODM
-dotenv - Environment variable management
-cors - Enable CORS for API requests
-bcryptjs - Password hashing
-jsonwebtoken - User authentication
-multer - File/image uploads
-body-parser - Handle request data
-nodemon - Auto-restarts the server on changes
-React icons for enhanced UI

-user sign up
-node mailer for email verification
-created store
-user login
-create an article
    -sign up at Cloudinary and get your Cloud Name
-
    
updated



PORT=4000
MONGODB_URL="mongodb+srv://sreelekshmi310192:2Df2AxN7YM6sa1qi@article-feed-web-app.8vhpo.mongodb.net/?retryWrites=true&w=majority&appName=article-feed-web-app"
FRONT_END_URL = "http://localhost:5173"


EMAIL_USER="sreelekshmi310192@gmail.com"
EMAIL_PASS="cbhm cuky kldp trin"

JWT_SECRET='Secret'
JWT_REFRESH_SECRET='RefreshSecret'