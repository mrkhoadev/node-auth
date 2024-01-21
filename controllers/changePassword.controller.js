const { string } = require("yup");
const { User, Device } = require("../models/index");
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');


const testPassword = async (value) => {
    if (value === "" || value.length < 8) {
        return true;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(value)) {
        return true;
    }
    return false;
}
module.exports = {
    index: async (req, res, next) => {
        res.render("pages/changePassword", { req });
    },
    handleChangePassword: async (req, res, next) => {
        let data;
        try {
            const isValidate = await req.validate(req.body, {
                email: string()
                    .required("Email bắt buộc phải nhập")
                    .email("Email không đúng định dạng")
                    .test("check-email", "Tài khoản không tồn tại", async (value) => {
                        if (!value.length) {
                            return true;
                        }
                        data = await User.findOne({ 
                            where: { email: value }
                        });
                        return data ? true : false;
                    }),
                passwordOld: string()
                    .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                    .required("Mật khẩu bắt buộc phải nhập")
                    .test("check-passwordOld", "Mật khẩu phải có ít nhất 1 ký tự đặc biệt, 1 ký tự viết hoa và 1 số!", testPassword),
                passwordNew: string()
                    .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                    .required("Mật khẩu bắt buộc phải nhập")
                    .test("check-passwordNew", "Mật khẩu phải có ít nhất 1 ký tự đặc biệt, 1 ký tự viết hoa và 1 số!", testPassword)
                    .test("compare-passwordOld", "Mật khẩu mới không được trùng với mật khẩu cũ!", (value) => {
                        if (value !== req.body.passwordOld) {
                            return true;
                        }
                        return false;
                    }),
                rePassword: string()
                    .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                    .required("Mật khẩu bắt buộc phải nhập")
                    .test("compare-passwordNew", "Mật khẩu không khớp, vui lòng kiểm tra lại!", (value) => {
                        if (value === req.body.passwordNew) {
                            return true;
                        }
                        return false;
                    }),
            })
            if (isValidate) {
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(req.body.passwordNew, salt);
                const result = await User.update(
                    { password: hashedPassword },
                    {
                        where: { id: data?.id }
                    }
                )
                if (result) {
                    await Device.update(
                        {
                            status: false
                        },{
                        where: { 
                            [Op.and]: [
                                { user_id: result[0] },
                                {
                                    [Op.not]: {
                                        token: req.session?.token
                                    }
                                }
                            ]
                        },
                    });
                    req.flash("msg", "Đổi mật khẩu thành công");
                    req.flash("old", { email: result?._previousDataValues?.email });
                    return res.redirect("/");
                }
                req.flash("msg", "Đổi mật khẩu thất bại!");
            } 
        } catch (e) {
            return next(e);
        }
        return res.redirect("/doi-mat-khau");
    }
}