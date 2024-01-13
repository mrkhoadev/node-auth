const { User } = require("../models/index");
const { string } = require("yup");
const bcrypt = require('bcrypt');

module.exports = {
    index: async (req, res, next) => {
        res.render("auth/login", { req });
    },
    handleLogin: async (req, res, next) => {
        let result;
        try {
            const isEmail = await req.validate(req.body, {
                email: string()
                    .required("Email bắt buộc phải nhập")
                    .email("Email không đúng định dạng")
                    .test("check-email", "Tài khoản không tồn tại", async (value) => {
                        result = await User.findOne({ where: { email: value } });
                        return result ? true : false;
                    }),
                password: string()
                    .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                    .required("Mật khẩu bắt buộc phải nhập")
            });
            if (isEmail) {
                const isPassword = await req.validate(req.body, {
                    password: string()
                            .test("check-password", "Tài khoản hoặc mật khẩu không chính xác!", 
                            async (value) => {
                                const isMatch = bcrypt.compare(value, result?.password);
                                return isMatch;
                            }),
                });
                if (isPassword) {
                    req.session.data = result
                    req.flash("msg", "Đăng nhập thành công");
                    return res.redirect("/");
                }
            }
            
        } catch (e) {
            return next(e);
        }
        return res.redirect("/dang-nhap");
    }
}