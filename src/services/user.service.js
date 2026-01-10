import { FOLDER_IMAGE } from "../common/constant/app.constant.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import fs from "fs"
import path from "path";
import cloudinary from "../common/cloudinary/init.cloudinary.js"
import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";

export const userService = {
    async avatarLocal(req) {
        console.log("file", req.file);
        console.log("body", req.body);
        if (!req.file) {
            throw new BadRequestException('Không thấy file')
        }
        await prisma.users.update({
            where: {
                id: req.user.id,
            },
            data: {
                avatar: req.file.filename,
            }
        });
        // đảm bảo 1 user - 1 avatar
        if (req.user.avatar) {
            // xóa cloud 
            cloudinary.uploader.destroy(req.user.avatar);

            // Xóa Local
            // hàm join trong thư viện path sẽ cover mọi hệ điều hành 
            const oldPath = path.join(FOLDER_IMAGE, req.user.avatar)
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            };
        }


        return `This action avatarLocal`;
    },
    async avatarCloud(req) {
        console.log("file", req.file);
        console.log("body", req.body);
        if (!req.file) {
            throw new BadRequestException('Không thấy file')
        }

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream((error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            }).end(req.file.buffer);
        });
        console.log(uploadResult);
        await prisma.users.update({
            where: {
                id: req.user.id,
            },
            data: {
                avatar: uploadResult.public_id,
            },
        });
        // đảm bảo 1 user - 1 avatar
        if (req.user.avatar) {
            // xóa cloud 
            cloudinary.uploader.destroy(req.user.avatar);

            // Xóa Local
            // hàm join trong thư viện path sẽ cover mọi hệ điều hành 
            const oldPath = path.join(FOLDER_IMAGE, req.user.avatar)
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            };
        }
        return true;
    },
    async create(req) {
        return `This action create`;
    },
    async findAll(req) {
        const { page, pageSize, where, index, filters } = buildQueryPrisma(req.query);
        //console.log("user payload", req.payload);
        //console.log("query", { page, pageSize, index, filters });

        //prisma
        const resultPrismaPromise = prisma.users.findMany({
            where: where,
            skip: index, // skip tới vị trị index nào ( OFFSET )
            take: pageSize, // take : lấy bao nhiêu phần tử ( LIMIT )
        });

        //sequelize
        // const resultSequelize = await Article.findAll();

        const totalItemPromise = prisma.users.count({
            where: where,
        });

        const [resultPrisma, totalItem] = await Promise.all([resultPrismaPromise, totalItemPromise])

        return {
            page: page,
            pageSize: pageSize,
            totalItem: totalItem,
            totalPage: Math.ceil(totalItem / pageSize),
            items: resultPrisma
        };
    },

    async findOne(req) {
        const user = await prisma.users.findUnique({
            where:{
                id: +req.params.id,
            },
        })
        return user;
        return `This action returns a id: ${req.params.id} user`;
    },

    async update(req) {
        return `This action updates a id: ${req.params.id} user`;
    },

    async remove(req) {
        return `This action removes a id: ${req.params.id} user`;
    }
};