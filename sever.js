// inlay int: console.log("hello"); => console.log(message:"hello");
import express from "express";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors" 
import { appError } from "./src/common/helpers/handle-error.helper.js";
import { NotFoundException } from "./src/common/helpers/exception.helper.js";
import { initGoogleStrategy } from "./src/common/passport/login-google.passport.js";

const app = express()

app.use(express.json()) // xử lí json trong postman 
app.use(cors(
    {
        origin: ["http://localhost:3000","https://www.google.com"]
    }
))

initGoogleStrategy()

app.use("/api",rootRouter);
app.use((req,res,next)=>{
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    console.log("APIIIIII",`${method} ${url} ${ip}`);
    throw new NotFoundException()
})
app.use(appError);

const port = 3069;
app.listen(port,() =>{
    console.log(`sever online at : ${port}`);

});
console.log(123);
// npx prisma db pull  : prisma sẽ vô db lấy thông tin cấu trúc của các table và tạo ra schema(model) bên trong code 
// npx prisma generate : tạo ra object(prisma-client) để chấm ra tấy cả table và sử dụng lấy dữ liệu 