const jwt = require('../modules/jwt');
// const MSG = require('../modules/responseMessage');
// const CODE = require('../modules/statusCode');
// const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authSocketUtil = {
  checkToken: async (socket, next) => {
    try {
      const connectedUser = []; // 연결된 클라이언트를 저장할 객체

      var token = socket.handshake.headers.authorization.split(' ')[1];
      let loginTime = new Date();
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

      socket.uSeq = user.uSeq;
      socket.uName = user.uName;
      socket.loginTime = loginTime;

      const userInfo = {
        socketId: socket.id,
        uSeq: socket.uSeq,
        uName: socket.uName,
        loginTime: socket.loginTime,
        gSeq: [],
      };

      // 중복된 uSeq를 가진 객체가 배열에 있는지 확인
      const isDuplicate = connectedUser.some(
        (user) => user.uSeq === userInfo.uSeq
      );

      // 중복이 아닌 경우에만 추가
      if (isDuplicate) {
        console.log('이미 연결되어 있는 소켓이 있으므로 연결종료');
        socket.disconnect(true);
      } else {
        connectedUser.push(userInfo);
        socket.connectedUser = connectedUser;
        socket.userInfo = userInfo;
      }

      next();
    } catch (error) {
      console.error('토큰 확인 중 서버 에러:', error);
      return next('토큰 확인 중 서버 에러');
    }
  },
};

module.exports = authSocketUtil;
