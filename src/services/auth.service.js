import { prisma } from "../common/prisma/connect.prisma.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import bcrypt from "bcrypt"
import { tokenService } from "./token.service.js";


export const authService = {
   async register(req) {
      const { email, password, fulName } = req.body;
      console.log({ email, password });

      // kiểm tra người dùng có hay chưa , nếu đã tồn tại  thì không cho đăng kí 
      const userExist = await prisma.users.findUnique({
         where: {
            email: email,
         }
      });
      // nếu người dùng đã tồn tại thì không cho đăng kí 
      if (userExist) {
         throw new BadRequestException("Người dùng đã tồn tại ,vui lòng đăng nhập")
      }
      // HASH - băm password 
      // mã hóa 1 chiều : không DỊCH NGƯỢC ĐƯỢC, chỉ được so sánh 
      // bcrypt băm pass chỉ sử dụng CPU , không dùng GPU   
      const hashPassword = bcrypt.hashSync(password, 10);


      // eamil này chauw tồn tại => tạo người dùng mới 
      await prisma.users.create({
         data: {
            email: email,
            password: hashPassword,
            fulName: fulName,
         },
      });
      return true;
   },
   async login(req) {
      const { email, password } = req.body;
      // kiểm tra email người dùng có tồn tại trong db hay không 
      // nếu mà tồn tại => đi tiếp 
      // nếu mà chưa tồn tại => trả lỗi ( Xin vui lòng đăng kí trước khi đăng nhập )
      const userExist = await prisma.users.findUnique({
         where: {
            email: email,
         },
      });
      if (!userExist) {
         throw new BadRequestException("Xin vui lòng đăng kí trước khi đăng nhập")
      }
      // kiểm tra password 
      const isPassword = bcrypt.compareSync(password, userExist.password)
      if (!isPassword) {
         throw new BadRequestException("Mật khẩu chưa chính xác ")
      }

      //Encrypt : Mã hóa 
      // mã hóa 2 chiều : CÓ THỂ DỊCH ĐƯỢC 
      const token = tokenService.createTokens(userExist.id);
      // console.log({email,password,userExist});
      return token;
   },
   async getInfo(req) {
      //console.log("getInfo Service", req.user);
      delete req.user.password;
      return req.user;
   },
   async googleCallback(req) {
      //console.log("user google", req.user);
      const {accessToken,refreshToken}=tokenService.createTokens(req.user.id);
      //console.log(accessToken,refreshToken)

      // truyền AT và RT trong query url của FE
      const urlRedirect = `http://localhost:3000/login-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      return urlRedirect;
   },
   async create(req) {
      return `This action create`;
   },
   async findAll(req) {
      return `This action returns all auth`;
   },
   async findOne(req) {
      return `This action returns a id: ${req.params.id} auth`;
   },
   async update(req) {
      return `This action updates a id: ${req.params.id} auth`;
   },
   async remove(req) {
      return `This action removes a id: ${req.params.id} auth`;
   }
};