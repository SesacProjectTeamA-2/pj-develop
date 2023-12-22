const jwt = require('../modules/jwt');
// const MSG = require('../modules/responseMessage');
// const CODE = require('../modules/statusCode');
// const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authSocketUtil = {
  checkToken: async (socket, next) => {
    try {
      var token = socket.handshake.headers.authorization.split(' ')[1];
      // 토큰 없음
      if (!token) return next('토큰 없음');

      // decode
      const user = await jwt.verify(token);

      // 유효기간 만료
      if (user === jwt.TOKEN_EXPIRED) return next('유효기간 만료된 토큰');

      // 유효하지 않는 토큰
      if (user === jwt.TOKEN_INVALID) return next('유효하지 않는 토큰');

      // 토근 : undefined
      if (user.uSeq === undefined) return next('토큰 : undefined');

      const userInfo = {
        uSeq: user.uSeq,
        uName: user.uName,
        socketId: socket.id,
        gSeq: user.gSeq,
      };

      socket.userInfo = userInfo;

      next();
    } catch (error) {
      console.error('토큰 확인 중 서버 에러:', error);
      return next('토큰 확인 중 서버 에러');
    }
  },
};

module.exports = authSocketUtil;
