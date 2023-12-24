const express = require('express');
const router = express.Router();
const controller = require('../controller/Cadmin');
const authUtil = require('../middlewares/auth').checkToken;

router.get('/users', controller.allUsers);

router.get('/groups', controller.allGroup);

module.exports = router;
