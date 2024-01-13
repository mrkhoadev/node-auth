const { object } = require("yup");
module.exports = (req, res, next) => {
    //Định nghĩa hàm validate để sử dụng bên controller
    req.validate = async (data, rules = {}) => {
        const schema = object(rules);
        try {
            const body = await schema.validate(data, {
                abortEarly: false,
            });
            return body;
        } catch (e) {
            const errors = Object.fromEntries(
                e.inner.map((item) => [item.path, item.message]),
            );
            req.flash("errors", errors);
            req.flash("old", data);
        }
    };
    //Lưu lỗi nếu validate failed vào req để thuận tiện hiển thị ở view
    const errors = req.flash("errors");
    req.errors = errors.length ? errors[0] : {};
    const old = req.flash("old");
    const msg = req.flash("msg");
    req.old = old.length ? old[0] : {};
    req.msg = msg.length ? msg[0] : '';
    next();
}