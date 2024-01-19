const {
  User,
  Group,
  GroupUser,
  GroupBoard,
  GroupBoardComment,
  GroupBoardIcon,
  Mission,
  Complain,
} = require('../models');
const Op = require('sequelize').Op;
const redisCli = require('../models/redis').redis_Cli;

exports.allUsers = async (req, res) => {
  try {
    const userArray = await User.findAll({
      include: [
        {
          model: GroupUser,
          attributes: ['guSeq', 'uSeq', 'gSeq', 'guIsLeader', 'guIsBlackUser'],
        },
      ],
    });

    const user_group = userArray.map((arr) => arr.tb_groupUsers);
    console.log(user_group);
    res.send({
      allUser: userArray,
      joinGroup: user_group,
    });
  } catch (err) {
    console.error('allUsers error', err);
  }
};

exports.outUsers = async (req, res) => {
  try {
    const uSeq = req.params.uSeq;

    await User.update(
      { isUse: null },
      {
        where: { uSeq },
      }
    );

    res.send({ isSuccess: 'true', msg: '유저 추방 완료' });
  } catch (err) {
    console.error('editUsers error', err);
  }
};

exports.blackUser = async (req, res) => {
  try {
    const uSeq = req.params.uSeq;
    const { guBanReason, gSeq, gName } = req.body;

    // 블랙 유저 data 처리
    await GroupUser.update(
      {
        guBanReason,
        guIsBlackUser: 'y',
      },
      { where: { uSeq, gSeq } }
    );

    // 신고 처리 update
    await Complain.update(
      { isDone: 1 },
      {
        where: { uSeq, gSeq },
      }
    );

    // redis 연동
    const blackUser = await GroupUser.findOne({ where: { uSeq, gSeq } });
    const blackTime = new Date();
    const receiver = blackUser.uSeq;
    const result = await redisCli.lPush(
      `user${receiver}`,
      JSON.stringify({
        type: 'groupAlarm',
        gSeq,
        gName,
        guBanReason,
        blackTime,
      })
    );

    // 만료시간 조회
    const expirationTime = await redisCli.ttl(`user${receiver}`);
    // 유효시간 7일
    if (expirationTime > 0) {
      console.log('이미 만료시간 설정되어 있음!');
    } else {
      await redisCli.expire(`user${receiver}`, 604800);
    }

    // redis pub 처리
    const allAlarm = await redisCli.lRange(`user${receiver}`, 0, -1);

    await redisCli.publish(
      `group-alarm${receiver}`,
      JSON.stringify({
        alarmCount: result,
        allAlarm,
        receiver,
      })
    );

    res.send({ isSuccess: true, msg: '모임 추방 완료' });
  } catch (err) {
    console.error('유저 블랙 서버 error!!', err);
  }
};

exports.allGroup = async (req, res) => {
  try {
    const groupArray = await Group.findAll();

    const groupUserArray = await GroupUser.findAll({
      attributes: ['guSeq', 'gSeq'],
      include: [
        {
          model: User,
          attributes: ['uName', 'uEmail'],
        },
      ],
    });

    res.send({
      allGroup: groupArray,
      groupUserArray,
    });
  } catch (err) {
    console.error('allGroup error', err);
  }
};

exports.delGroup = async (req, res) => {
  try {
    const gSeq = req.params.gSeq;
    await Group.destroy({ where: { gSeq } });
    res.send({ isSuccess: 'true' });
  } catch (err) {
    console.error('delGroup error', err);
  }
};

exports.complain = async (req, res) => {
  try {
    const result = await Complain.findAll();

    const cuSeqArray = result.map((seq) => seq.cuSeq);
    const cuNameArray = await User.findAll({
      where: { uSeq: { [Op.in]: cuSeqArray } },
      attributes: ['uSeq', 'uName'],
    });

    const gSeqArray = result.map((item) => item.gSeq);
    const gNameArray = await Group.findAll({
      where: { gSeq: { [Op.in]: gSeqArray } },
      attributes: ['gSeq', 'gName'],
    });

    res.send({ result, gNameArray, cuNameArray });
  } catch (err) {
    console.error('complain error', err);
  }
};
