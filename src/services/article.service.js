

//DATABASE FIRST : tạo db đầu tiên => code 

import Article from "../models/article.model.js";

//CODE FIRST : code trước => nạp vào db
export const articleService = {
    async findAll() {
        const result = await Article.findAll()
        
        return result;
    },
}