const express = require('express');
const router = express.Router();
const controller = require('../controller/Cgroup');
const authUtil = require('../middlewares/auth').checkToken;

router.get('/users', controller.allUser);

router.get('/groups', controller.allGroup);
