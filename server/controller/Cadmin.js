const {
  User,
  Group,
  GroupUser,
  GroupBoard,
  GroupBoardComment,
  GroupBoardIcon,
  Mission,
} = require('../models');
// 로그인 된 사용자인지 아닌지 판별하려면 불러와야함
const jwt = require('../modules/jwt');
const authUtil = require('../middlewares/auth');
const { token } = require('morgan');
const score = require('../modules/rankSystem');

exports.allUsers = async (req, res) => {
  try {
    const userArray = await User.findAll({
      include: [
        {
          model: GroupUser,
          attribute: ['guSeq', 'gSeq', 'guIsLeader', 'guIsBlackUser'],
        },
      ],
    });

    const user_group = userArray.map((arr) => arr.tb_groupUser);

    res.send({
      allUser: userArray,
      joinGroup: user_group,
    });
  } catch (err) {
    console.error('allUsers error', err);
  }
};

exports.delUsers = async (req, res) => {
  try {
    const uSeq = req.params.uSeq;

    await User.destroy({
      where: { uSeq },
    });

    res.send({ isSuccess: 'true' });
  } catch (err) {
    console.error('editUsers error', err);
  }
};

exports.allGroup = async (req, res) => {
  try {
    const groupArray = await Group.findAll();

    const groupUserArray = await GroupUser.findAll({
      group: ['gSeq'],
      attribute: ['gSeq'],
      include: [
        {
          model: User,
          attribute: ['uName', 'uEmail'],
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
