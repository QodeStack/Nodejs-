import  express from "express";
import { articleController } from "../controllers/article.controller.js";
import { BadRequestException, NotFoundException } from "../common/helpers/exception.helper.js";

const articleRouter = express.Router();

articleRouter.get("/",
    (req, res, next)=>{
       // console.log("mid 1");
        const payload = {
            email : "@gmail.com",
            pass : "123",
        }
        req.payload = payload;
        //throw new BadRequestException("mật khẩu không chính xác")

        // Lỗi kiểm soát được 
        //throw new Error("mật khẩu không chính xác")
        
        // Lỗi không kiểm soát được 
        // const abc = undefined;
        // console.log(abc.email);

        next();
    },
    (req, res, next)=>{
       // console.log("mid 2");
       // console.log("payload", req.payload);
        next();
    },
    (req, res, next)=>{
       // console.log("mid 3");
        next();
    },
    articleController.findAll);



articleRouter.post("/",articleController.create);
articleRouter.put("/:id",articleController.update);
articleRouter.get("/:id",articleController.findOne);
articleRouter.delete("/:id",articleController.delete);
export default articleRouter