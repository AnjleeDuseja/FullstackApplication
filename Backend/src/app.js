import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

import router from './routes/user.routes.js';

app.use("/api/v1/user", router);

export default app;