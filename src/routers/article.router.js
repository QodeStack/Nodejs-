import  express from "express";

const articleRouter = express.Router();

articleRouter.get("/get-list-article",(req,res,next)=>{
    res.status(200).json({
        message:"helo cyberrrrrr"
    })
});

export default articleRouter