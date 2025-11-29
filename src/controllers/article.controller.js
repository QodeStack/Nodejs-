import { responseSuccess } from "../common/helpers/function.helper.js";
import { articleService } from "../services/article.service.js"

export const articleController = {
    async findAll (req, res, next) {
        const result =await articleService.findAll()
        const respone = responseSuccess(result,"Get list article success",200)
        res.status(respone.statusCode).json(respone);
    },
}