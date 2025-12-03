import { responseSuccess } from "../common/helpers/function.helper.js";
import { articleService } from "../services/article.service.js"

export const articleController = {
    async findAll (req, res, next) {
        const result =await articleService.findAll(req)
        const respone = responseSuccess(result,"Get list article success",200)
        res.status(respone.statusCode).json(respone);
    },
    async findOne(req, res, next) {
        const result =await articleService.findOne(req)
        const respone = responseSuccess(result,"Get detail article success",200)
        res.status(respone.statusCode).json(respone);
    },
    async delete(req, res, next) {
        const result =await articleService.delete(req)
        const respone = responseSuccess(result,"delete article success",200)
        res.status(respone.statusCode).json(respone);
    },
}