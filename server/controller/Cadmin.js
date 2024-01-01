const {
  User,
  Group,
  GroupUser,
  GroupBoard,
  GroupBoardComment,
  GroupBoardIcon,
  Mission,
} = require('../models');

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

    res.send({ isSuccess: 'true' });
  } catch (err) {
    console.error('editUsers error', err);
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
