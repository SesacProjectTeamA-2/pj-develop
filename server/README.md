# <img src="./public/logo.svg" width="35px" alt="[Logo]"> **Motimates Back-end**

<br/>

# 🧑‍🤝‍🧑 **Team Crew** - BE


| [문영민](https://github.com/eoeung) | [문효진](https://github.com/jinnymoon1124) | [최태영](https://github.com/chitty12) |
|---|---|---|
| <img src="https://avatars.githubusercontent.com/u/134040422?v=4" width="100px" height="100px" alt="이미지 설명"> | <img src="https://avatars.githubusercontent.com/u/100422752?v=4" width="100px" height="100px" alt="이미지 설명"> | <img src="https://avatars.githubusercontent.com/u/107044870?v=4" width="100px" height="100px" alt="이미지 설명">| 
| ㆍ개발/배포 환경 분리 설정 <br> ㆍSwagger 파일 분리 적용 <br> ㆍ구글 로그인 | ㆍJWT 미들웨어 <br> ㆍ게시글 API <br> ㆍ카카오 로그인| ㆍ유저, 미션, 모임 API <br> ㆍ네이버 로그인 |

<br>

# 📂 **다운로드**

```bash
# 백엔드 소스 다운로드
$ git clone https://github.com/SesacProjectTeamA-2/pj-back.git
```

\+ 화면에서 실행하고 싶은 경우, 진행

```bash
# 프론트엔드 소스 다운로드
$ git clone https://github.com/SesacProjectTeamA-2/pj-front.git
```

<br/>

# 🛠️ **사용한 기술**

[![Node][Node.js]][Node-url] <br>
[![Express][Express]][Express-url] <br>
[![Sequelize][Sequelize]][Sequelize-url] <br>
[![MySQL][MySQL]][MySQL-url] <br>
[![Swagger][Swagger]][Swagger-url] <br>

<br>

# 📚 **주요 라이브러리**

- cors
- cross-env
- express-basic-auth
- jsonwebtoken
- node-cron

<br>

# 🚀 **ERD**

![image](https://user-images.githubusercontent.com/134040422/284274008-c402135f-6528-4cdc-b63b-70dd69a4bc54.png)

<br>

## ＊반정규화
![image](https://user-images.githubusercontent.com/134040422/284274029-53a281dd-465f-4a44-ad22-3ad2fb5068f8.png)

|    테이블명    | 관계 및 추가 정보 |
|----------------|-------------------|
| group - mission | - 모임당 하나의 디데이 및 여러 미션을 설정하고 있어 1대다 관계. <br> - 미션에 대한 디데이가 지났는지 여부에 대한 데이터 저장을 위한 컬럼(isExpired) 설정. | 
| groupBoard - groupUser | - 게시물을 작성시 해당 미션(mSeq)은 ‘미션 완료’로 간주하고(‘y’) <br> - 모임참여유저의 점수가 업데이트. <br> - 난이도 정보가 필요하여 mission Table 을 JOIN |
| group - groupUser | - 모임의 총 점수와 모임 참여 유저의 현재점수를 사용하여 달성률 및 랭킹을 추출. <br> - 달성률/랭킹을 위한 table을 모델링하게 된다면, 구조가 복잡해지고 데이터저장을 위한 공간이 필요하므로, 반정규화 채택. |
| groupBoard - mission | - 미션 완료 여부에 대한 컬럼을 groupBoard에 포함. 관계 테이블을 정의하면 한 번의 JOIN을 더 거치게 되어 반정규화 |


<br>

# ⚙️ **개발 환경 설정**

## 1. .env 파일 설정

- config 폴더 밑에 **.env**파일을 생성

```bash
# .env 파일 생성
$ cd pj-back
$ touch .env
```

## 2. Swagger 설정

JWT를 사용해서 Bearer 토큰값이 필요한 경우, 설정해주는 부분

```javascript
// config/swagger.js
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
},
```

<br>

Swagger 로그인 설정(아이디, 비밀번호 입력)

```javascript
app.use(
  '/api-docs', // YOUR_URL/api-docs : Swagger 호출
  eba({ // const eba = require('express-basic-auth');
    // swagger 로그인 설정
    challenge: true,
    users: { YOUR_SWAGGER_ID: 'YOUR_SWAGGER_PW' }, // ID: PW
  }),
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
```

|  전송 정보 예시 | 결과값 예시 |
|---|---|
| ![image](https://github.com/SesacProjectTeamA-2/pj-back/assets/107044870/694a6129-39a3-4ed0-a3b7-54aea5938aa9) | ![image](https://github.com/SesacProjectTeamA-2/pj-back/assets/107044870/84cf5350-4b94-4717-9ed0-4b53177ec208) |


## 3. 기타 API Key 값 설정
### 1) 소셜 로그인
- 구글 로그인
- 카카오 로그인
- 네이버 로그인
### 2) AWS S3

### [★★ .env 파일 샘플 코드 바로가기 !!! ★★](./config/sample.env)

<br>

# 🏃‍♂️ **서버 구동**

```bash
# git clone 이후에 실행
$ cd pj-back

# 개발 서버 (localhost:YOUR_PORT)
$ npm start

# 배포 서버 (YOUR_DOMAIN:YOUR_PORT)
$ npm run start:prod
```

<br>

# 📂 **프로젝트 폴더 구조:**

```JS
├── app.js
├── config
├── controller
├── middlewares
├── models
├── modules
│   ├── swagger
│   │    ├── parameter
│   │    │    ├─ path
│   │    │    ├─ query
│   │    ├── requestBody
│   │    ├── response
└── routes
```

<br/>

<!-- 이모지 검색 사이트 -->
<!-- https://tools.picsart.com/text/emojis/ -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Node.js]: https://img.shields.io/badge/node.js-3c873a?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express]: https://img.shields.io/badge/Express-ffffff?style=for-the-badge&logo=Express&logoColor=000000
[Express-url]: https://expressjs.com/
[Sequelize]: https://img.shields.io/badge/Sequelize-000000?style=for-the-badge&logo=Sequelize&logoColor=52b0e7
[Sequelize-url]: https://sequelize.org/
[MySQL]: https://img.shields.io/badge/MySQL-5d87a2?style=for-the-badge&logo=MySQL&logoColor=f49823
[MySQL-url]: https://www.mysql.com/
[Swagger]: https://img.shields.io/badge/Swagger-85ea2d?style=for-the-badge&logo=Swagger&logoColor=173647
[Swagger-url]: https://swagger.io/
