import { buildSchema } from "graphql";
import { articleService } from "../../../services/article.service.js";

// import các function 


// {
//         "id": 1,
//         "title": "title nè",
//         "content": "content nè",
//         "imageUrl": "https://picsum.photos/seed/1/600/400",
//         "views": 15,
//         "userId": 1,
//         "isDeleted": false,
//         "createdAt": "2024-01-01T08:00:00.000Z",
//         "updatedAt": "2025-12-03T13:21:36.000Z"
// }
const schema = buildSchema(`
    type Article {
        id: Int
        title : String 
        content : String  
        imageUrl: String  
        views : Int  
        userId : Int
        createdAt : String
        updatedAt : String 
    }
    # Định nghĩa các API cho article 
    # define các API về GET 
    type Query {
        articles: [Article]

        article(id: Int!):Article
    }
    type Mutation {
        createArticle(title:String!,content:String!):Article
    }
`)

const root = {
    async articles() {
        const req = {
            query :{
                page : 1,
                pageSize : 50
            }
        }
        const result = await articleService.findAll(req);
        return  result.items;
    },
    async article(arg){
        const req = {
            params : {
                id : arg.id
            }
        }
        return await articleService.findOne(req)
    },
    async createArticle(arg){
        const req = {
            body : arg
        }
        return await articleService.create(req);
    }
}
export {
    schema,
    root
}