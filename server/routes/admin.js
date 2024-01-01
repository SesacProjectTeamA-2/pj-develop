const express = require('express');
const router = express.Router();
const controller = require('../controller/Cadmin');
const authUtil = require('../middlewares/auth').checkToken;

router.get('/users', controller.allUsers);
// router.patch('/users/:uSeq', controller.editUsers);
router.patch('/users/:uSeq', controller.outUsers);

router.get('/groups', controller.allGroup);
// router.patch('/groups', controller.editGroup);
router.delete('/groups/:gSeq', controller.delGroup);

module.exports = router;
