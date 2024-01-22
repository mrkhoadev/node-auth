const { User, Device } = require("../models/index");
const getTime = require("../helpers/getTime")

module.exports = {
    index: async (req, res, next) => {
        try {
            const browser_info = await Device.findAll({
                order: [["id", "desc"]],
                where: {
                    user_id: req.session?.data?.id
                }
            });
            res.render("index", { data: req.session?.data, devices: browser_info, req, getTime });
        } catch (e) {
            return next(e);
        }
    },
    logout: async (req, res, next) => {
        try {
            await Device.update(
                {
                    status: false,
                },
                {
                    where: { 
                        token: req.session?.token,
                    },
                    include: {
                        model: User,
                        as: "users",
                        where: {
                            id: req.session?.data?.id,
                        }
                    }
                }
            );
            delete req.session?.data;
            
            req.flash("msg", "Đăng xuất thành công!")
            res.redirect("/dang-nhap");
        } catch (e) {
            return next(e)
        }
    },
    handleLogoutDevice: async (req, res, next) => {
        const { id } = req.params;
        try {
            const result = await Device.update(
                {
                    status: false,
                },
                {
                    where: { 
                        id: +id,
                    },
                }
            );
            if (!result) {
                throw new Error("Không tìm thấy thiết bị");
            }
            req.flash("msg", "Đăng xuất thành công!")
        } catch (e) {
            return next(e)
        }
        return res.redirect("/");
    },
}