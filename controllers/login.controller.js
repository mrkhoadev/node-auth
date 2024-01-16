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
                        if (!value.length) {
                            return true;
                        }
                        result = await User.findOne({ where: { email: value } });
                        return result ? true : false;
                    }),
                password: string()
                    .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                    .required("Mật khẩu bắt buộc phải nhập")
                    .test("check-password", "Mật khẩu phải có ít nhất 1 ký tự đặc biệt, 1 ký tự viết hoa và 1 số!", async (value) => {
                        if (value === "" || value.length < 8) {
                            return true;
                        }
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                        if (passwordRegex.test(value)) {
                            return true;
                        }
                        return false;
                    })
            });
            if (isEmail) {
                const isMatch = await bcrypt.compare(req.body?.password, result?.password);
                if (isMatch) {
                    if (result.status) {
                        req.session.data = result
                        req.flash("msg", "Đăng nhập thành công");
                        return res.redirect("/");
                    } else {
                        req.flash("error", "Tài khoản chưa được cấp phép!");
                    }
                } else {
                    req.flash("error", "Tài khoản hoặc mật khẩu không chính xác!");
                }
            }
        } catch (e) {
            return next(e);
        }
        return res.redirect("/dang-nhap");
    }
}