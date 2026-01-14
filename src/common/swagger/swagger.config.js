import { info } from "console";
import { version } from "os";
import { title } from "process";
import { Component } from "react";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//B1: Định nghĩa thông tin cơ bản về API 
const swaggerDefinition = {
    openapi : `3.0.0`, // Phiên bản OpenAPI 
    info:{
        title:'Cyber Community API',
        version: '1.0.0',
        description : 'API về hệ thống quản lí cộng đồng '
    },
    servers:[
        {
            url : 'http://localhost:3069/api',
            description : 'Develop server'
        }
    ],
    componets: {
        securitySchemes : {
            bearerAuth : {
                type : 'http',
                scheme: 'bearer',
                bearerFomat : 'JWT',
                description : ' Nhập JWT để xác thực , Format: Bearer {token} '
            }
        }
    }
} 
// cấu hình swagger-jsdocx
const options = {
    definition : swaggerDefinition,
    apis: [
        './src/routers/*.js',
        './server.js'
    ]

}
// tạo swagger 
const swaggerSpec = swaggerJsDoc(options);

// thêm swagger vào middleware để public swagger UI
export const setupSwagger = (app) =>{
    app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
    console.log("swagger UI avaiable at : http://localhost:3069/api-docs")
}


