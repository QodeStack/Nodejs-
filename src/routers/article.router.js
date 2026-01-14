import  express from "express";
import { articleController } from "../controllers/article.controller.js";
import { BadRequestException, NotFoundException } from "../common/helpers/exception.helper.js";

const articleRouter = express.Router();
/**
 * @swagger
 * /article:
 *   get:
 *     summary: Lấy danh sách tất cả bài viết
 *     tags: [Article]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
 */

// http://localhost:3069/api/article/get-list-article
articleRouter.get("/",
    (req, res, next)=>{
       // console.log("mid 1");
        const payload = {
            email : "@gmail.com",
            pass : "123",
        }
        req.payload = payload;
        //throw new BadRequestException("mật khẩu không chính xác")

        // Lỗi kiểm soát được 
        //throw new Error("mật khẩu không chính xác")
        
        // Lỗi không kiểm soát được 
        // const abc = undefined;
        // console.log(abc.email);

        next();
    },
    (req, res, next)=>{
       // console.log("mid 2");
       // console.log("payload", req.payload);
        next();
    },
    (req, res, next)=>{
       // console.log("mid 3");
        next();
    },
    articleController.findAll);

/**
 * @swagger
 * /article:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Article]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tiêu đề bài viết
 *               content:
 *                 type: string
 *                 example: Nội dung bài viết
 *     responses:
 *       200:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Article'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.post("/",articleController.create);

articleRouter.put("/:id",articleController.update);
articleRouter.get("/:id",articleController.findOne);
articleRouter.delete("/:id",articleController.delete);
export default articleRouter