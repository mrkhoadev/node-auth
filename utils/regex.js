const emailRegex = (str) => {
    return /^(([^<>()[\]\.,;:\s@"]+(.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/.trim().test(
        str
    );
};
const htmlScript = (html) => {
    return html?.replace(/(<([^>]+)>)/gi, "").trim();
};
module.exports = { emailRegex, htmlScript };