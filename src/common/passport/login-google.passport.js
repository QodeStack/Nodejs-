import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
//var GoogleStrategy = require('passport-google-oauth20').Strategy;
import passport from "passport"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRECT } from '../constant/app.constant.js';
import { BadRequestException } from '../helpers/exception.helper.js';
import { prisma } from '../prisma/connect.prisma.js';


/**
 * Phải chạy trước mọi api xử lí về login google 
 */
export const initGoogleStrategy = () => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRECT,
        callbackURL: "http://localhost:3069/api/auth/google-callback"
    },
    async function (accessToken, refreshToken, profile, cb) {
           //console.dir({ accessToken, refreshToken, profile }, { colors: true, depth: null });
            const email = profile.emails[0].value;
            const isVerified = profile.emails[0].verified;
            const fullName = profile.displayName;
            const googleId = profile.id;
            const avatar = profile.photos[0].value;

            //console.log({ email, isVerified, fullName, googleId, avatar });

            if (!isVerified) {
                // thất bại 
                cb(new BadRequestException("Email chưa được xác thực "), null);
                return; 
            }

            const userExits = await prisma.users.findUnique({
                where:{
                    email:email,
                }
            })

            // Nếu mà không có tài khoản thì tạo mới 
            // sẽ luôn cho người dùng đăng nhập 
            // vì bên phía google đã hổ trợ xác thực 
            if (!userExits){
                await prisma.users.create({
                    data:{
                        email:email,
                        googleId:googleId,
                        avatar:avatar,
                        fullName:fullName,
                    },
                });
            }

            // thành công 
            cb(null,userExits); // nó tương đương với req.user = userExits;
        }
    ));
}
    