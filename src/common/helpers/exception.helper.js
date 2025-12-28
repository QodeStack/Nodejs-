import { statusCodes } from "./status-code.helper.js";
export class BadRequestException extends Error {
    constructor(message ="BadRequestException") {
        super(message)
         this.code = statusCodes.BAD_REQUEST ; 
    }
};
/**
 * 401: yêu cầu Fe logout 
 */
export class UnauthorizedException extends Error {
    constructor(message ="UnauthorizedException") {
        super(message)
         this.code = statusCodes.UNAUTHORIZED ; 
    }
};
/**
 * 403: Fe yêu cầu làm mới accessToken
 */
export class ForbiddenException extends Error {
    constructor(message ="ForbiddenException") {
         this.code = statusCodes.FORBIDDEN ; 
    }
};
/**
 * 404 : không tìm thấy ...
 */
export class NotFoundException extends Error {
    constructor(message ="NotFoundException") {
        super(message)
         this.code = statusCodes.NOT_FOUND ; 
    }
};

