import express from 'express';
import articleRouter from './article.router.js';

const rootRouter = express.Router()

rootRouter.use("/article",articleRouter)

export default rootRouter