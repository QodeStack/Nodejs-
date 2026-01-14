import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { protect } from '../common/middleware/protect.middleware.js';
import passport from 'passport';

const authRouter = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Lỗi validation hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/register",authController.register);
authRouter.post("/login",authController.login);
authRouter.get("/get-info",protect,authController.getInfo);

// người dùng click button google 
// kích hoạt logic của passport , để passport xử lý với google , cùng với yêu cầu tôi muốn lấy email và profile
// sau khi passport làm việc với google xong , passport sẽ tự redirect người dùng tới trang đăng nhập google 
authRouter.get("/google",passport.authenticate("google",{scope: ["email","profile"]}));

// sau khi người dùng chọn tài khoản và đồng ý với bên google 
// passprot sẽ lấy code và xử  lí với bên google=> lấy thông tin gmail => kích hoạt hàm verify ở trong src\common\passport\login-google.passport.js
authRouter.get("/google-callback",passport.authenticate("google",{failureRedirect:"/login",session : false }),authController.googleCallback); 

authRouter.post("/refresh-token",authController.refreshToken)

// Tạo route CRUD
// authRouter.post('/', authController.create);
// authRouter.get('/', authController.findAll);
// authRouter.get('/:id', authController.findOne);
// authRouter.patch('/:id', authController.update);
// authRouter.delete('/:id', authController.remove);

export default authRouter;