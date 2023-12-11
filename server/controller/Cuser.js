const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config({ path: __dirname + '/../config/.env' });
// config
const config = require(__dirname + '/../config/config.js')[
  process.env.NODE_ENV
];

const { serverUrl, serverPort, frontPort, naverClientId, naverClientSecret } =
  config; // 서버 설정

const { User } = require('../models');
const { Op, where } = require('sequelize');

// 로그인 된 사용자인지 아닌지 판별하려면 불러와야함
const jwt = require('../modules/jwt');
const authUtil = require('../middlewares/auth');
const score = require('../modules/rankSystem');

// #################################################
// ################# [LOGIN START] #################
// #################################################
// ################# [Kakao LOGIN] #################
// #################################################
// 카카오 로그인 화면
exports.getOAuth = (req, res) => {
  const REST_API_KEY = process.env.REST_API_KEY;
  const REDIRECT_URL = `${serverUrl}:${serverPort}` + process.env.REDIRECT_URL;
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URL}`;
  res.redirect(kakaoAuthURL);
};

// 카카오 로그인 redirect
exports.getKakao = async (req, res) => {
  const { code } = req.query; // 카카오로부터 전달받은 인증 코드
  const REST_API_KEY = process.env.REST_API_KEY;
  const REDIRECT_URL = `${serverUrl}:${serverPort}` + process.env.REDIRECT_URL;

  // 액세스 토큰 요청을 위한 데이터 생성
  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('client_id', REST_API_KEY);
  data.append('redirect_uri', REDIRECT_URL);
  data.append('code', code);

  try {
    // 카카오 OAuth 서버로 POST 요청 보내기
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // 응답 데이터에서 액세스 토큰 추출
    const { access_token } = response.data;

    const kakaoUser = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userEmail = kakaoUser.data.kakao_account.email;
    const userName = kakaoUser.data.properties.nickname;
    const userImg = kakaoUser.data.properties.profile_image;

    const alreadyUser = await User.findOne({
      where: {
        uEmail: userEmail,
      },
    });

    // db에 값 있으면 이미 회원가입 한 유저
    if (alreadyUser) {
      // 해당 3개의 값 가지는 토큰 생성
      const jwtToken = await jwt.sign({
        uSeq: alreadyUser.uSeq,
        userName: userName,
        userEmail: userEmail,
      });

      res.cookie('token', jwtToken.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });

      // ****************** 토큰을 들고 메인 페이지로 렌더링해야함
      let redirectUrl = `${serverUrl}:${frontPort}/main`;
      redirectUrl += `?userImg=${userImg}`;
      redirectUrl += `&userName=${userName}`;
      redirectUrl += `&userEmail=${userEmail}`;
      redirectUrl += `&token=${jwtToken.token}`;
      res.redirect(redirectUrl);
    } else {
      // 최초 로그인 하는 유저
      // *************** 토큰 발급 없이 회원가입 창으로 렌더링 필요
      let redirectUrl = `${serverUrl}:${frontPort}/join`;
      redirectUrl += `?userImg=${userImg}`;
      redirectUrl += `&userName=${userName}`;
      redirectUrl += `&userEmail=${userEmail}`;
      res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
    let redirectUrl = `${serverUrl}:${frontPort}/main`;
    redirectUrl += `?msg=액세스 토큰 요청 중 오류 발생`;
    res.redirect(redirectUrl);
  }
};

// #################################################
// ################# [Naver LOGIN] #################
// #################################################
// 네이버 url로 연결.
exports.getLoginNaver = (req, res) => {
  const NaverClientId = naverClientId;
  const RedirectUri = encodeURI(
    `${serverUrl}:${serverPort}/api/user/login/naver/callback`
  );
  const State = 'test';
  const NaverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NaverClientId}&state=${State}&redirect_uri=${RedirectUri}`;
  res.redirect(NaverAuthUrl);
};

// 로그인하여 정보처리 동의시, redirectUri 로 code 발급.
exports.getLoginNaverRedirect = async (req, res) => {
  // 회원정보에 동일한 email이 있으면, session 생성
  // 없으면 회원가입위해 {nickname, email, profile Img} send

  const NaverClientId = naverClientId;
  const NaverClientIdSecret = naverClientSecret;
  const RedirectUri = encodeURI(
    `${serverUrl}:${serverPort}/api/user/login/naver/callback`
  );
  // 발급된 code 변수할당.
  // code 값은 토큰 발급 요청에 사용됨.
  let code = req.query.code;
  let callbackState = req.query.state;

  // 토큰발급 요청 url
  let api_url =
    'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
    NaverClientId +
    '&client_secret=' +
    NaverClientIdSecret +
    '&code=' +
    code +
    '&state=' +
    callbackState;

  // 토큰 발급 요청
  axios({
    method: 'get',
    url: api_url,
    headers: {
      'X-Naver-Client-Id': NaverClientId,
      'X-Naver-Client-Secret': NaverClientIdSecret,
    },
  })
    .then((tokenRes) => {
      return axios({
        method: 'get',
        url: 'https://openapi.naver.com/v1/nid/me',
        // 프로필 api url
        headers: {
          Authorization:
            tokenRes.data.token_type + ' ' + tokenRes.data.access_token,
        },
      });
    })

    .then(async (userRes) => {
      const userEmail = userRes.data.response.email;
      const userName = userRes.data.response.nickname;
      const userImg = userRes.data.response.profile_image;

      const alreadyUser = await User.findOne({
        where: {
          uEmail: userEmail,
        },
      });

      // db에 값 있으면 이미 회원가입 한 유저
      if (alreadyUser) {
        // 해당 3개의 값 가지는 토큰 생성
        const jwtToken = await jwt.sign({
          uSeq: alreadyUser.uSeq,
          userName: userName,
          userEmail: userEmail,
        });

        res.cookie('token', jwtToken.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        });

        // ****************** 토큰을 들고 메인 페이지로 렌더링해야함
        let redirectUrl = `${serverUrl}:${frontPort}/main`;
        redirectUrl += `?userImg=${userImg}`;
        redirectUrl += `&userName=${userName}`;
        redirectUrl += `&userEmail=${userEmail}`;
        redirectUrl += `&token=${jwtToken.token}`;
        res.redirect(redirectUrl);
      } else {
        // 최초 로그인 하는 유저
        // *************** 토큰 발급 없이 회원가입 창으로 렌더링 필요
        let redirectUrl = `${serverUrl}:${frontPort}/join`;
        redirectUrl += `?userImg=${userImg}`;
        redirectUrl += `&userName=${userName}`;
        redirectUrl += `&userEmail=${userEmail}`;
        res.redirect(redirectUrl);
      }
    });
};

// #################################################
// ################# [Google LOGIN] #################
// #################################################
// GET '/api/user/login/google'
// 구글 로그인
// 참고 자료 : https://velog.io/@mainfn/Node.js-express%EB%A1%9C-%EA%B5%AC%EA%B8%80-OAuth-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84
// 구글 로그인 버튼을 클릭하면 도착하는 라우터
// 모든 로직을 처리한 뒤, 구글 인증 서버인 https://accounts.google.com/o/oauth2/v2/auth으로 redirect됨
// → 이 url에 첨부할 몇 가지 QueryString이 필요
exports.getLoginGoogle = (req, res) => {
  let url = process.env.GOOGLE_OAUTH_ACCOUNT_URL;
  // OAuth API에서 발급받은 clinet_id 추가
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
  // OAuth API에 등록한 redirect url
  url += `&redirect_uri=${serverUrl}:${serverPort}${process.env.GOOGLE_LOGIN_REDIRECT_URI}`;
  // 필수 옵션
  url += `&response_type=code`;
  // 구글에 등록된 유저의 email, profile, openid을 가져오겠다고 명시
  url += '&scope=email profile openid';
  res.redirect(url);
};

// GET '/api/user/login/google/redirect'
// 구글 로그인 처리
// 구글 계정 선택 화면에서 계정 선택 후, redirect 된 주소
// → OAuth API 등록시 입력한 승인된 리디렉션 URI 주소 입력
// 아까 등록한 GOOGLE_LOGIN_REDIRECT_URI 일치해야 함
exports.getLoginGoogleRedirect = async (req, res) => {
  const { code } = req.query;

  // access_token 등 구글 토큰 정보 가져오기
  try {
    const tokenInfo = await axios.post(process.env.GOOGLE_OAUTH_TOKEN_URL, {
      // x-www-form-urlencoded(body)
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:
        `${serverUrl}:${serverPort}` + process.env.GOOGLE_LOGIN_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    // 토큰 정보
    const { access_token, token_type } = tokenInfo.data;

    // 1) 구글 계정 정보 존재
    if (access_token) {
      // token_type: 'Bearer'
      // email, gmail, profile, openid 등의 사용자 구글 계정 정보 가져오기
      const googleUserInfo = await axios.get(process.env.GOOGLE_USERINFO_URL, {
        // Request Header에 Authorization 추가
        headers: {
          Authorization: `${token_type} ${access_token}`, // 'Bearer ~~~'
        },
      });

      const { email, verified_email, name, picture } = googleUserInfo.data; // 유저 정보

      // 2) 회원가입 되어있는지 확인
      const alreadyUser = await User.findOne({
        where: {
          uEmail: email,
        },
      });

      // 3) 회원
      if (alreadyUser) {
        // 해당 3개의 값 가지는 토큰 생성
        const jwtToken = await jwt.sign({
          uSeq: alreadyUser.uSeq,
          userName: name,
          userEmail: email,
        });
        res.cookie('token', jwtToken.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        });

        let redirectUrl = `${serverUrl}:${frontPort}/main`;
        redirectUrl += `?userImg=${picture}`;
        redirectUrl += `&userName=${name}`;
        redirectUrl += `&userEmail=${email}`;
        redirectUrl += `&token=${jwtToken.token}`;
        res.redirect(redirectUrl);
        // 4) 비회원
      } else {
        // 4-1) 검증(확인)된 메일일 경우에만 회원 가입 진행
        if (verified_email) {
          let redirectUrl = `${serverUrl}:${frontPort}/join`;
          redirectUrl += `?userImg=${picture}`;
          redirectUrl += `&userName=${name}`;
          redirectUrl += `&userEmail=${email}`;
          res.redirect(redirectUrl);
        } else {
          let redirectUrl = `${serverUrl}:${frontPort}/main`;
          redirectUrl += `?isSuccess=${false}`;
          redirectUrl += `&msg=검증되지 않은 Gmail입니다.`;
          res.redirect(redirectUrl); // 검증(확인)된 메일 X
        }
      }
    } else {
      let redirectUrl = `${serverUrl}:${frontPort}/main`;
      redirectUrl += `?isSuccess=${false}`;
      redirectUrl += `&msg=해당 Gmail은 존재하지 않습니다.`;
      res.redirect(redirectUrl); // 구글 계정 정보 존재 X
    }
  } catch (err) {
    console.error(err);
    let redirectUrl = `${serverUrl}:${frontPort}/main`;
    redirectUrl += `?isSuccess=${false}`;
    redirectUrl += `&msg=error`;
    res.redirect(redirectUrl); // 에러
  }
};

// GET '/api/user/login/test'
// 테스트 계정 로그인
exports.getLoginTest = async (req, res) => {
  try {
    let { testNum } = req.query;
    const whereCondition = {};
    testNum = parseInt(testNum, 10);

    if (testNum === 1) {
      whereCondition.uEmail = 'test1@motimates.xyz';
    } else if (testNum === 2) {
      whereCondition.uEmail = 'test2@motimates.xyz';
    }

    const selectOneTestEmail = await User.findOne({
      where: whereCondition,
    });

    if (selectOneTestEmail) {
      const { uSeq, uEmail, uName, uImg } = selectOneTestEmail;

      // 해당 3개의 값 가지는 토큰 생성
      const jwtToken = await jwt.sign({
        uSeq,
        userName: uName,
        userEmail: uEmail,
      });

      res.cookie('token', jwtToken.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });

      // ****************** 토큰을 들고 메인 페이지로 렌더링해야함
      let redirectUrl = `${serverUrl}:${frontPort}/main`;
      redirectUrl += `?userImg=${uImg}`;
      redirectUrl += `&userName=${uName}`;
      redirectUrl += `&userEmail=${uEmail}`;
      redirectUrl += `&token=${jwtToken.token}`;
      res.redirect(redirectUrl);
    } else {
      res.send({ isSuccess: false, msg: '테스트 계정이 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.send({ isSuccess: false, msg: 'error' });
  }
};

// #################################################
// ################# [// LOGIN END] ################
// #################################################

// POST '/api/user/register'
// 회원가입
exports.postRegister = async (req, res) => {
  try {
    let { uEmail, uName, uImg, uCharImg, uCategory1, uCategory2, uCategory3 } =
      req.body;

    // null 값 있는지 검사 : 필수값은 3개
    if (!uEmail || !uName || !uCharImg) {
      return res.send({
        OK: false,
        msg: '입력 필드 중 하나 이상이 누락되었습니다.',
      });
    }

    // 중복 검사 (uEmail, uNname)
    const uEmailIsDuplicate = await User.count({ where: { uEmail } });
    const uNameIsDuplicate = await User.count({ where: { uName } });

    if (uEmailIsDuplicate || uNameIsDuplicate) {
      return res.send({
        OK: false,
        uEmailIsDuplicate,
        uNameIsDuplicate,
        msg: 'uEmail 또는 uNname 가 이미 존재합니다.',
      });
    }

    // 사용자 추가
    const newUser = await User.create({
      uEmail: uEmail,
      uName: uName,
      uImg: uImg,
      uCharImg: uCharImg,
      uCategory1: uCategory1,
      uCategory2: uCategory2,
      uCategory3: uCategory3,
    });

    // 여기에는 이미 가입한 유저는 오지 않으니
    // 새로 create하고 db에서 그 유저의 uSeq 가져와서 토큰 생성
    const newUserToken = await User.findOne({
      where: {
        uEmail: uEmail,
      },
    });
    // 해당 3개의 값 가지는 토큰 생성
    const jwtToken = await jwt.sign({
      uSeq: newUserToken.uSeq,
      userName: uName,
      userEmail: uEmail,
    });
    res.cookie('token', jwtToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    res.status(200).send({
      uEmail: newUser.uEmail,
      uName: newUser.uName,
      uImg: newUser.uImg,
      uCharImg: newUser.uCharImg,
      uCategory1: newUser.uCategory1,
      uCategory2: newUser.uCategory2,
      uCategory3: newUser.uCategory3,
      token: jwtToken.token,
    });
  } catch (err) {
    console.error(err);
    res.send({
      msg: err.message,
      OK: false,
    });
  }
};

// 프로필 수정 화면
exports.getProfile = async (req, res) => {
  try {
    // 로그인된 상태
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);

      // 보여줄 정보 : 닉네임, 설명, 캐릭터, 관심분야(null), 메인화면 설정(dday, 달성량), 커버이미지
      const userSeq = user.uSeq;
      const userInfo = await User.findOne({
        where: { uSeq: userSeq },
      });

      const {
        uEmail,
        uName,
        uImg,
        uCharImg,
        uCoverImg,
        uDesc,
        uPhrase,
        uCategory1,
        uCategory2,
        uCategory3,
        uSetDday,
        uMainDday,
        uMainGroup,
        isUse,
      } = userInfo;

      if (isUse) {
        res.send({
          result: true,
          isBlock: true,
          nickname: uName,
          userImg: uImg,
          character: uCharImg,
          coverImg: uCoverImg,
          coverLetter: uDesc,
          phrase: uPhrase,
          category1: uCategory1,
          category2: uCategory2,
          category3: uCategory3,
          setDday: uSetDday,
          mainDday: uMainDday,
          setMainGroup: uMainGroup,
        });
      } else {
        res.send({
          result: true,
          isBlock: false,
          message: '관리자에 의해 추방된 유저입니다.',
        });
      }
      // 비로그인 상태
    } else {
      res.send({
        result: false,
        message: '로그인 해주세요!',
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      msg: err.message,
      OK: false,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    // 로그인된 상태
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);
      const {
        uName,
        uDesc,
        uPhrase,
        uCharImg,
        uCategory1,
        uCategory2,
        uCategory3,
        uSetDday,
        uMainDday,
        uMainGroup,
      } = req.body;

      const isNickname = await User.findOne({
        where: { uName: uName, uSeq: { [Op.ne]: user.uSeq } },
      });

      // 닉네임이 이미 존재하는 경우
      if (isNickname) {
        res.send({ result: false, message: '이미 존재하는 닉네임입니다.' });
      } else {
        await User.update(
          {
            uName,
            uDesc,
            uPhrase,
            uCharImg,
            uCategory1,
            uCategory2,
            uCategory3,
            uSetDday,
            uMainDday,
            uMainGroup,
          },
          {
            where: { uSeq: user.uSeq },
          }
        );
        res.send({ result: true, message: '회원정보 수정 완료!' });
      }
    } else {
      res.send({ result: false, message: '로그인 해주세요!' });
    }
  } catch (err) {
    console.error(err);
    res.send({
      msg: err.message,
      OK: false,
    });
  }
};

exports.userImg = async (req, res) => {
  // uImg,
  try {
    // 로그인된 상태
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);
      if (req.file.location) {
        const imageUrl = req.file.location; // 업로드된 이미지의 S3 URL

        await User.update(
          {
            uImg: imageUrl,
          },
          {
            where: { uSeq: user.uSeq },
          }
        );
        res.send({ result: true, message: '이미지 업로드 성공' });
      } else {
        res.send({ result: false, message: '이미지가 첨부되지 않았습니다' });
      }
    } else {
      res.send({ result: false, message: '로그인 해주세요!' });
    }
  } catch (err) {
    console.error(err);
    res.send({
      msg: err.message,
      OK: false,
    });
  }
};

exports.userCoverImg = async (req, res) => {
  try {
    // 로그인된 상태
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);
      if (req.file.location) {
        const imageUrl = req.file.location; // 업로드된 이미지의 S3 URL

        await User.update(
          {
            uCoverImg: imageUrl,
          },
          {
            where: { uSeq: user.uSeq },
          }
        );
        res.send({ result: true, message: '이미지 업로드 성공' });
      } else {
        res.send({ result: false, message: '이미지가 첨부되지 않았습니다.' });
      }
    } else {
      res.send({ result: false, message: '로그인 해주세요!' });
    }
  } catch (err) {
    console.error(err);
    res.send({
      msg: err.message,
      OK: false,
    });
  }
};

// 회원탈퇴
exports.delUser = async (req, res) => {
  try {
    // 로그인된 상태
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);

      await User.destroy({
        where: { uSeq: user.uSeq },
      });

      res.send({
        result: true,
        message: '회원탈퇴 완료',
      });

      // 비로그인 상태
    } else {
      res.send({
        result: false,
        message: '로그인 해주세요!',
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      msg: err.message,
      OK: false,
    });
  }
};
