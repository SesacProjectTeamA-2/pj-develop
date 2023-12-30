const express = require('express');
const router = express.Router();
const controller = require('../controller/Cchat');
const upload = require('../middlewares/imgUpload').upload;

const authUtil = require('../middlewares/auth').checkToken;

router.get('/roomInfo', authUtil, controller.roomList);

module.exports = router;
