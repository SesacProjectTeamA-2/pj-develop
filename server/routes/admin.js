const express = require('express');
const router = express.Router();
const controller = require('../controller/Cadmin');
const authUtil = require('../middlewares/auth').checkToken;

router.get('/users', controller.allUsers);
router.patch('/users/:uSeq', controller.editUsers);
router.delete('/users/:uSeq', controller.delUsers);

router.get('/groups', controller.allGroup);
router.patch('/groups', controller.editGroup);
router.delete('/groups', controller.delGroup);

module.exports = router;
