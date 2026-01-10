import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

export const chatMessageService = {
   async create(req) {
      return `This action create`;
   },

   async findAll(req) {
    const { page,pageSize,where,index,filters} = buildQueryPrisma(req.query);
        console.log("service payload", req.payload);
        console.log("query",{ page , pageSize ,index,filters});

        //prisma
        const resultPrismaPromise = prisma.chatMessage.findMany({
            where:where,
            skip:index, // skip tới vị trị index nào ( OFFSET )
            take:pageSize, // take : lấy bao nhiêu phần tử ( LIMIT )
            orderBy :{
                createdAt : "desc",
            }
        });

        //sequelize
        // const resultSequelize = await Article.findAll();

        const totalItemPromise =  prisma.chatMessage.count({
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

   async findOne(req) {
      return `This action returns a id: ${req.params.id} chatMessage`;
   },

   async update(req) {
      return `This action updates a id: ${req.params.id} chatMessage`;
   },

   async remove(req) {
      return `This action removes a id: ${req.params.id} chatMessage`;
   }
};