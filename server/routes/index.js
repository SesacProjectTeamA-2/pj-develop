const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const groupRouter = require('./group');
const boardRouter = require('./board');
const commentRouter = require('./comment');
const missionRouter = require('./mission');
const alarmRouter = require('./alarm');
const adminRouter = require('./admin');
const chatRouter = require('./chat');

// index 라우터에는 각각의 라우터에 대한 태그와 설명을 작성
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 관련 API
 */
router.use('/user', userRouter); // 유저
/**
 * @swagger
 * tags:
 *   name: Group
 *   description: 모임 관련 API
 */
router.use('/group', groupRouter); // 모임

/**
 * @swagger
 * tags:
 *   name: Board
 *   description: 게시글 관련 API
 */
router.use('/board', boardRouter); // 게시글

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 게시글 댓글 관련 API
 */
router.use('/comment', commentRouter); // 게시글

/**
 * @swagger
 * tags:
 *   name: Mission
 *   description: 미션 관련 API
 */
router.use('/mission', missionRouter); // 미션

router.use('/subscribe', alarmRouter); // 알림

router.use('/admin', adminRouter); // 관리자 페이지

router.use('/chat', chatRouter); //채팅 관련 api

module.exports = router;
