const express = require('express');
const router = express.Router();
const controller = require('../controller/Calarm');
const authUtil = require('../middlewares/auth').checkToken;

router.get('/alarm', authUtil, controller.alarm);
