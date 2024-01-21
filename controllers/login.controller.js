const { User, Device } = require("../models/index");
const { string } = require("yup");
const bcrypt = require('bcrypt');
const parser = require('ua-parser-js');
const md5 = require('md5');

module.exports = {
    index: async (req, res, next) => {
        res.render("auth/login", { req });
    },
    handleLogin: async (req, res, next) => {
        try {
            const isValidate = await req.validate(req.body, {
                email: string()
                    .required("Email bắt buộc phải nhập")
                    .email("Email không đúng định dạng"),
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
            if (isValidate) {
                const result = await User.findOne({
                    where: { email: isValidate.email }
                });
                if (!result) {
                    req.flash("error", "Tài khoản không tồn tại!");
                    return res.redirect("/dang-nhap");
                }
                const isMatch = await bcrypt.compare(req.body?.password, result?.password);
                if (isMatch) {
                    if (result.status) {
                        if (!req.session.token) {
                            const { browser, os } = parser(req.headers['user-agent']);
                            const hashedData = md5(new Date().getTime() + Math.random());
                            req.session.token = hashedData;
                            
                            await Device.create({ 
                                token: hashedData,
                                browser_name: browser.name,
                                browser_version: browser.version,
                                os_name: os.name,
                                os_version: os.version,
                                user_id: result.id,
                             })
                        }
                        req.session.data = result;
                        req.flash("msg", "Đăng nhập thành công");
                        return res.redirect("/");
                    }
                    req.flash("error", "Tài khoản chưa được cấp phép!");
                } else {
                    req.flash("error", "Tài khoản hoặc mật khẩu không chính xác!");
                }
                req.flash("old", { email: req.body.email });
            }
        } catch (e) {
            return next(e);
        }
        return res.redirect("/dang-nhap");
    }
}