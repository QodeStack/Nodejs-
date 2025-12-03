import  express from "express";
import { articleController } from "../controllers/article.controller.js";

const articleRouter = express.Router();

articleRouter.get("/",articleController.findAll);
articleRouter.get("/:id",articleController.findOne)
articleRouter.delete("/:id",articleController.delete)
export default articleRouter