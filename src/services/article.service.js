

//DATABASE FIRST : tạo db đầu tiên => code 

import { create } from "domain";
import { prisma } from "../common/prisma/connect.prisma.js";
import Article from "../models/article.model.js";
import { Json } from "sequelize/lib/utils";
import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";

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
        
        const { page,pageSize,where,index} = buildQueryPrisma(req.query);

        //console.log("query",{ page , pageSize ,index,filters});

        //prisma
        const resultPrismaPromise = prisma.articles.findMany({
            where:where,
            skip:index, // skip tới vị trị index nào ( OFFSET )
            take:pageSize, // take : lấy bao nhiêu phần tử ( LIMIT )
        });

        //sequelize
        // const resultSequelize = await Article.findAll();

        const totalItemPromise =  prisma.articles.count({
            where:where,
        });

        const [resultPrisma,totalItem] =await Promise.all([resultPrismaPromise,totalItemPromise])
         
        return {
            page:page,
            pageSize :pageSize,
            totalItem :  totalItem,
            totalPage : Math.ceil(totalItem / pageSize),
            items : resultPrisma 
        };
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
    },
    /**
     * Body
     * THường dùng : FE gửi dữ liệu nhiề , tạo mới , xử lý ....
     */
    async create(req) {
        console.log("body", req.body);
        const {title,content} = req.body;
        const articleNew = await prisma.articles.create({
            data:{
                title: title,
                content: content,
                userId :1
            },
        });

        return articleNew;
    },
    async update(req){
        const {id} = req.params;
        const {title,content} = req.body;

        const articleUpdate= await prisma.articles.update({
            where:{
                id:+id
            },
            data:{
                title:title,
                content:content
            }
        });
        return articleUpdate;
    },
};