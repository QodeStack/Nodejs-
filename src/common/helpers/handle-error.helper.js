import { responseError } from "./function.helper.js";

/**
 * gom các lỗi có trong dự án 
 */
export const appError = (err,req,res,next) => { // chỉ được tồn tại 1 middleware đặc biệt là 4 tham số
        console.log("middleware đặc biệt , bắt lỗi ",err);

        const response = responseError(err?.message, err.code,err?.stack);
        res.status(response.statusCode).json(response);

};