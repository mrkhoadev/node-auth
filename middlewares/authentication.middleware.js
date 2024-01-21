const { Device } = require("../models/index");

module.exports = async (req, res, next) => {
    
    const pathname = req.originalUrl
                        .split("/")
                        .filter((p) => p)[0];
    if (req.session.token) {
        try {
            const result = await Device.findOne({
                where: {
                    token: req.session.token
                }
            });
            if (result && result.status) {
                const currentDateTime = new Date();
                await Device.update(
                    { updated_at: currentDateTime },
                    {
                        where: {
                            id: result.id
                        }
                    }
                )
                // await await Device
                // Nếu tìm thấy thiết bị, kiểm tra pathname
                if (pathname === "dang-nhap" || pathname === "dang-ky") {
                    return res.redirect('/');
                }
            } else {
                delete req.session.token;
                return res.redirect('/dang-nhap');
            }
        } catch (error) {
            return next(error);;
        }
    } else {
        if (pathname !== "dang-nhap" && pathname !== "dang-ky") {
            return res.redirect('/dang-nhap');
        }
    }
    next();
}