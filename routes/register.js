var express = require('express');
var router = express.Router();

const registerController = require("../controllers/register.controller")

/* GET users listing. */
router.get('/', registerController.index);
router.post('/', registerController.handleRegister);

module.exports = router;