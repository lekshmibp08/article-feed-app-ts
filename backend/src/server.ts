import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import connectDB from "./infrastructure/database/mongodb"
import { config } from "./config/config"
import { errorHandler } from "./interfaces/middleware/errorMiddleware"


import authRoutes from './interfaces/routes/authRoutes'
import userRoutes from './interfaces/routes/userRoutes'
import articleRoutes from './interfaces/routes/articleRoutes'

const app = express();
const PORT = config.app.PORT || 4000;
const FRONT_END_URL = config.cors.CLIENT_URL;

app.use(
    cors({
        origin: FRONT_END_URL,
        allowedHeaders: config.cors.ALLOWED_HEADERS,
        methods: config.cors.ALLOWED_METHODS,
        credentials: config.cors.CREDENTIALS
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', articleRoutes);


app.get("/", (req, res) => {
  res.send("API running...");
});

app.use(errorHandler);

connectDB();
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});