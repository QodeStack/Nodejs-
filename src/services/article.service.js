

//DATABASE FIRST : tạo db đầu tiên => code 

import { prisma } from "../common/prisma/connect.prisma.js";
import Article from "../models/article.model.js";

//CODE FIRST : code trước => nạp vào db
export const articleService = {
    /**
     * 
     *  QUERY (Luôn luôn dữ liệu nhận là string)
     *  api lấy danh sách bài viết
     *  FE sẽ gửi lên dữ liệu thông qua Query 
     *  Cách nhận biết: bắt đầu từ chấm hỏi "?" , phân tách các biến với nhau bằng dấu "&" 
     *  Thường dùng : phân trang , lọc , tìm kiếm , ... 
     */
    async findAll(req) {
        const {page,pageSize} = req.query;
        console.log("query",{ page , pageSize });
        //prisma
        const resultPrisma =await prisma.articles.findMany({
            where:{
                isDeleted:false,
            }
        });

        //sequelize
        const resultSequelize = await Article.findAll();
        return resultPrisma;
    },
    /**
     * PATH PARAM (Luôn luôn dữ liệu nhận là string)
     * cách nhận biết : "/:id"
     * Thường dùng: lấy chi tiết (detail), 1 item
     */
    async findOne(req){
        console.log("params",req.params);
        const {id} = req.params;
        const article = await prisma.articles.findUnique({
            where :{
                id:+id,
                isDeleted:false,
            }
        })
        return article;
    },
    /**
     * HEADERS
     * Thường dùng : để gửi token , API-KEY,...
     */
    async delete(req){
        console.log("params",req.params);
        const {id} = req.params;
        console.log("header",req.headers)
        // xóa thật trong DB (không nên dùng khi đi làm)
        // await prisma.articles.delete({
        //     where:{
        //         id:+id
        //     }
        // })

        // xóa mềm : không xóa thực bên trong db 
        await prisma.articles.update({
            where:{
                id:+id
            },
            data:{
                isDeleted : true,
            }
        })

        return true; 
    }  
};