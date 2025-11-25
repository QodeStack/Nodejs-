// inlay int: console.log("hello"); => console.log(message:"hello");
import express from "express";
import rootRouter from "./src/routers/root.router.js";


const app = express()
app.use("/api",rootRouter)

app.get("/hello",(req,res,next)=>{
    res.status(201).json({
        message:"helo cyber"
    })
});

const port = 3069;
app.listen(port,() =>{
    console.log(`sever online at : ${port}`);

});
console.log(123);