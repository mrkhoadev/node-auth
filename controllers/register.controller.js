const { User } = require("../models/index");
const { string } = require("yup");
const bcrypt = require('bcrypt');

module.exports = {
    index: async (req, res, next) => {
        res.render("auth/register", { req });
    },
    handleRegister: async (req, res, next) => {
        try {
            const body = await req.validate(req.body, {
                name: string().required("Tên bắt buộc phải nhập"),
                email: string()
                    .required("Email bắt buộc phải nhập")
                    .email("Email không đúng định dạng")
                    .test("check-emailRegister", "Email đã tồn tại", async (value) => {
                        const result = await User.findOne({ where: { email: value } });
                        return result ? false : true;
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
                    }),
                status: string().test(
                        "check-status",
                        "Trạng thái không hợp lệ",
                        (value) => {
                        return +value === 0 || +value === 1;
                    }),
            });
            if (body) {
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(body?.password, salt);
                const newBody = {
                    ...body,
                    password: hashedPassword,
                    status: body.status === "1"
                }
                const data = await User.create(newBody);
                req.flash("msg", "Đăng ký thành công");
                req.flash("old", { email: data?._previousDataValues?.email });
                return res.redirect("/dang-nhap");
            }
        } catch (e) {
            return next(e);
        }
        return res.redirect("/dang-ky");
    }
}