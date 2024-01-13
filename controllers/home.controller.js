module.exports = {
    index: async (req, res, next) => {
        res.render("index", { data: req.session?.data });
    },
    logout: async (req, res, next) => {
        delete req.session?.data;
        req.flash("msg", "Đăng xuất thành công!")
        res.redirect("/dang-nhap");
    },
}