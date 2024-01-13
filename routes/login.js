var express = require('express');
var router = express.Router();

const loginController = require("../controllers/login.controller")

/* GET users listing. */
router.get('/', loginController.index);
router.post('/', loginController.handleLogin);

module.exports = router;