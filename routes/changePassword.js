var express = require('express');
var router = express.Router();

const changePasswordController = require("../controllers/changePassword.controller")

/* GET users listing. */
router.get('/', changePasswordController.index);
router.post('/', changePasswordController.handleChangePassword);

module.exports = router;