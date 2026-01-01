import { responseError } from "./function.helper.js";

import jwt from "jsonwebtoken"
import { statusCodes } from "./status-code.helper.js";
/**
 * gom các lỗi có trong dự án 
 */
export const appError = (err,req,res,next) => { // chỉ được tồn tại 1 middleware đặc biệt là 4 tham số
        console.log("middleware đặc biệt , bắt lỗi ",err);
        if (err instanceof jwt.JsonWebTokenError){
                err.code = statusCodes.UNAUTHORIZED; 
        }
        if (err instanceof jwt.TokenExpiredError){
                err.code = statusCodes.FORBIDDEN;
        }
        console.log("code",err.code);
        const response = responseError(err?.message, err.code,err?.stack);
        res.status(response.statusCode).json(response);

};