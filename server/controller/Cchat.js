const redisCli = require('../models/redis');

exports.chatSocket = async (groupChat, connectedUser) => {
  try {
    groupChat.on('login', (data) => {
      const uName = data.uName;
    });
  } catch (err) {
    console.log('소켓 통신 err', err);
  }
};
