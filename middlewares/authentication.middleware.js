module.exports = (req, res, next) => {
    const pathname = req.originalUrl
                        .split("/")
                        .filter((p) => p)[0];
    if (!pathname && !req.session?.data) {
        return res.redirect('/dang-nhap');
    } else if ((pathname === "dang-nhap" || pathname === "dang-ky") && req.session?.data) {
        return res.redirect('/');
    }
    next();
}