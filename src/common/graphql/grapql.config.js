//graphql
//query => API GET
// mutation => API POST , PUT ,DELETE

import {graphqlHTTP} from 'express-graphql';

// import schema,resolver (nơi viết function để tương tác với database)
import { schema,root } from './schema/article.schema.js';

// setup graphql
export const setupGraphql = (app) =>{
    app.use('/graphql',graphqlHTTP({
        // schema 
        schema :schema,
        rootValue:root, // import những function 
        // bất mode UI graphQl
        graphiql: true,
        //handle error nếu có 
        customFormatErrorFn:(err)=>{
            console.log("Graphql err",err)
            return {
                message:err.message,
                locations:err.locations,
                path:err.path,
                stack: err.stack
            }
        }
    }))
    // console thông báo đã setup GraphQl
    console.log("GraphQl UI avaiable at http://localhost:3069/graphql");
}