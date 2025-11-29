// inlay int: console.log("hello"); => console.log(message:"hello");
import express from "express";
import rootRouter from "./src/routers/root.router.js";


const app = express()
app.use("/api",rootRouter)



const port = 3069;
app.listen(port,() =>{
    console.log(`sever online at : ${port}`);

});
console.log(123);
// npx prisma db pull  : prisma sẽ vô db lấy thông tin cấu trúc của các table và tạo ra schema(model) bên trong code 
// npx prisma generate : tạo ra object(prisma-client) để chấm ra tấy cả table và sử dụng lấy dữ liệu 