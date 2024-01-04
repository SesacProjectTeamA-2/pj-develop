const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");
const authUtil = require("../middlewares/auth").checkToken;

// 모든 유저 조회
router.get("/users", controller.allUsers);
// router.patch('/users/:uSeq', controller.editUsers);

// 회원 추방
router.patch("/users/:uSeq", controller.outUsers);

// 모임 추방
router.patch("/black/:uSeq", controller.blackUser);

// 모든 모임 조회
router.get("/groups", controller.allGroup);
// router.patch('/groups', controller.editGroup);

// 모임 삭제
router.delete("/groups/:gSeq", controller.delGroup);

// 신고 목록
router.get("/complain", controller.complain);

module.exports = router;
