# pj-develop

Motimates 팀프로젝트 디벨롭

# Motimates 란 ?

## " Motivation + Mates "

서로 동기부여를 주는 메이트들
모임 멤버들과 함께 목표를 달성하는 커뮤니티 사이트

## 🌐 웹 사이트 주소

[React App](http://www.motimates.link/)

# 프로젝트 소개

[발표자료](https://docs.google.com/presentation/d/1UivNxBP8XjSI-RzhUDjz8jncA31Cnq1xG4xU3MldGts/edit#slide=id.g4dfce81f19_0_45)
[Notion](https://polydactyl-cello-2db.notion.site/Motimates-4617b0dbabe640deb5336bb2dddcd54a?pvs=4)

## ⏰ 제작 기간

December 08, 2023 ~ January 04, 2023

## **🧑‍🤝‍🧑** Team Crew

| 프론트 개발                            | 백 개발                               |
| -------------------------------------- | ------------------------------------- |
| [김세화](https://github.com/loveflora) | [최태영](https://github.com/chitty12) |

## 담당 역할

**김세화**

- UI
  - 페이지 : 모임 관련 페이지(생성 및 수정, 홈, 검색), 게시판 관련 페이지(공지, 자유, 미션, 완료, 댓글)
  - 공통 컴포넌트 : 모달창(성공, 경고, 선택), 멤버 리스트, 디데이, 크기별 버튼
- 기능

  - 모임 CRUD
    - 모임 생성, 수정, 삭제
    - 모임 상세화면 조회
    - 유저가 가입한 모임 조회, 생성한 모임 조회
    - 모임 검색(검색어, 카테고리별)
    - 모임별 미션 수정
    - 현재 모임에 참석한 멤버리스트 조회
  - 모임 가입하기, 탈퇴하기, 모임장 위임하기
    - 참석인원에 따른 가입제한
  - 모임장, 멤버, 가입되지 않은 유저별 구분된 모임 사이드바
  - 게시판(공지, 자유, 미션별) CRUD
    - 모임 공지사항, 자유, 미션별 게시글 전체 및 상세 조회
    - 모임 공지사항, 자유, 미션별 게시글 생성, 수정, 삭제
  - 댓글 CRUD
    - 모임 공지사항, 자유, 미션별 게시글에 대한 댓글 조회
    - 댓글 생성 수정, 삭제
  - 유저별 미션 조회
  - 모임별 미션 조회
  - 유효성 검사 (모임 및 게시판 생성 및 수정 시)

**최태영**

- 아키텍쳐 설계
  - DBMS 추가, socket.io 통신 추가, route53, redisLabs 사용
- 서버 배포 및 DB 관리
- 채팅 기능
  - 소켓 통신시 JWT 토큰으로 회원 인증
  - 로그인시 모임별 채팅방 입장
    - 현재 로그인되어 있는 유저 보여주기
    - 로그인 이후 모든 메세지 Load
  - 모임 가입시 채팅방 입장 및 채팅 리스트 추가
- 실시간 알림 기능
  - 게시판 댓글 작성, 모임추방시 실시간 알림 생성
  - 읽음처리시 삭제기능
- 랭킹 관련 기능
  - scheduling (mission, d-day, score)
    - 모임 디데이 만료시, 누적 점수 업데이트, 디데이 초기화, 미션 초기화, 현재 점수 초기화 기능
  - 미션 인증시 점수 및 랭킹 업데이트
    - 게시판 미션 인증시 현재 점수 업데이트 및 랭킹 업데이트 기능
- 관리자 페이지 관련 api
  - 신고 기능
  - 모임 추방 or 회원 추방 기능
  - 유저 관리, 모임 관리 기능

# 시작 가이드

<!-- - 추가... -->

```bash
$ git clone https://github.com/SesacProjectTeamA-2/pj-develop
```

```
$ npm i
$ npm start
```

# ⚙️ 개발 환경

## Front

<p>
<img src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>
<img src="https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=TypeScript&logoColor=white"/>
<img src="https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=CSS3&logoColor=white"/>
<img src="https://img.shields.io/badge/Github-000000?style=flat-square&logo=Github&logoColor=white"/>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white"/>
</p>

## Back

<p>
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white"/>
<img src="https://img.shields.io/badge/socket.io-010101?style=flat-square&logo=socket.io&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=flat-square&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=flat-square&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=flat-square&logo=mysql&logoColor=white"> 
<img src="https://img.shields.io/badge/Sequelize-4B0082.svg?style=flat-square&logo=sequelize&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/>
<img src="https://img.shields.io/badge/nginx-%23009639.svg?style=flat-square&logo=nginx&logoColor=white"/>
</p>

# API 명세서

<img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=Swagger&logoColor=white">

Swagger 를 통해 개인별 Token 할당 후, api 전송 정보 및 결과값을 참조해 개발 및 소통

[Swagger](http://motimates.xyz:8888/api-docs/#/)

| User                                                                                                           | Group                                                                                                          | Board                                                                                                          | Comment                                                                                                        | Mission                                                                                                        |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| ![image](https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/52928695-90f1-4280-a5c8-6883bc9d2b62) | ![image](https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/bdda3aba-1250-458c-93d2-ea33e53b63e1) | ![image](https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/33fa621b-5607-44d8-9e92-91112621ab4a) | ![image](https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/92326590-fb62-4312-a4c2-79424f05bac5) | ![image](https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/82123195-6d25-409d-97f1-01e0a8910373) |

# 협업 / 소통

노션 내 회의 / 칸반보드 / 트러블 슈팅 등 문서화

| 회의                                                                                                              | 칸반보드                                                                                                          | 트러블 슈팅                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/107044870/5c3d7670-3c9d-42f7-9ca4-1e61a81ca6ba) | ![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/107044870/b804b087-cded-4bdb-b4a6-4015cfa61cd2) | ![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/107044870/2e97c160-a247-456a-92ac-167c4057911d) |

# Functions

✅ 메인페이지

✅ 소셜 로그인

✅ 마이페이지

✅ 모임 검색

✅ 모임 CRUD

✅ 모임 가입 & 탈퇴

✅ 모임장 권한 넘기기

✅ 모임 게시판 CRUD

✅ 댓글 CRUD

✅ 404 페이지

# 주요 기능

✅ 헤더
![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/2a80a778-b24a-49ff-84ea-2895aded4787)
![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/222d21b1-62d8-4c74-b82a-85801f7a53ed)

- 로고
- 초대 링크 input
- 메인, 그룹, 마이 페이지 연결
- 로그인 여부 및 업로드 여부에 따른 헤더 프로필사진 변경
- 모바일 헤더 추가에 따른 반응형 적용

✅ 실시간 그룹 채팅

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/9d237855-7b0a-4708-a4cc-3959994a85d1' width='300px' height='200px' />

- Socket.io-client를 통한 실시간 그룹 채팅방 구현
- local storage에 그룹 시퀀스별로 미확인 메세지 개수 저장
- 최신순 및 리더순으로 채팅방 정렬하는 토글 기능 구현
- 채팅방 참여 시 메세지 읽음 처리, 현재 접속한 유저 확인 가능, 메세지 내역 load
- 메세지 전송 시, 클라이언트 측에서 이벤트를 emit하여 서버 측으로 데이터 전송
- 로그아웃 시, 소켓 연결 종료

✅ 실시간 알람

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/ac6e2a55-7060-48ad-b24d-ce475de76ac6' width='300px' height='200px' />

- SSE(Server-Sent Event)를 통한 실시간 알람 구현
- 최초 로그인 시, 토큰 값을 전송하여 SSE 연결 요청
- local storage에 미확인 메세지 개수 저장
- 미확인 알람 전체 리스트를 state로 관리
- 실시간으로 알람 수신 시, useState 함수를 활용하여 업데이트
- `읽음` 버튼 클릭 시, Axios를 통한 REST API의 **`DELETE`** 요청으로 해당 알람 삭제 처리

✅ 관리자 페이지

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/c51dd519-8d68-4b49-957e-a05f482c21d5' width='300px' height='200px' />

- Chart.js 라이브러리를 활용하여 데이터 시각화
- 관리자 권한으로 특정 유저 및 그룹 삭제 가능

✅ 인트로 페이지

<img src='https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/4cfa54b6-2c05-40ae-8768-7d67784bbdfa' width='300px' height='200px' />

- 동기 부여를 위한 영상/이미지 소스/글귀 첨부

✅ 메인페이지

<img width="686" alt="메인" src="https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/31fcbb9d-5af7-46a5-91ed-b12abde414f6">

<img width="686" alt="메인" src="https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/24c39ba2-c1c4-4fa5-a72c-3c0036c84981">

- 사용자/모임별 미션 조회
- 마이페이지 정보 반영
- 명언 랜덤 API 사용

✅ 소셜 로그인 & 회원가입

<img width="373" alt="로그인" src="https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/08ae5c0d-2c76-4598-a10c-9e5f2841a0bf">

- Naver 로그인
- 쿠키를 통한 로그인 여부 구분

✅ 마이페이지

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/8bcab75b-2562-4b32-a613-9daf0764bb4e' width='300px' height='200px' />

- 프로필 사진 설정
- 닉네임 & 자기소개 설정
- 관심분야 설정
- 캐릭터 설정
- 명언 모드 선택(랜덤/직접 작성)
- 회원 탈퇴

✅ 모임 검색

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/15e522f2-de95-430d-835c-319483e59fce' width='300px' height='200px' />

- 카테고리 필터링
- 전체 검색

✅ 모임 CRUD

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/e0e1c417-0d30-4e47-ab31-3b9c4700cfb3' width='300px' height='200px' />

- 모임 생성
- 모임 정보 수정
- 모임 삭제
- 전체 멤버 리스트 조회
- 가입/생성 모임 조회

✅ 모임 가입 & 탈퇴

 <img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/d9c28c82-7442-4141-9c2c-f785b2fed467' width='300px' height='200px' />

- 링크 초대 가입 기능 추가

✅ 모임 게시판 CRUD

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/a3f7cca0-2e34-40db-8ca3-a0f66e3e9d00' width='300px' height='200px' />

- 미션 게시판
- 인증 시 랭킹 반
- 자유 게시판
- 공지사항 게시판
  - 관리자만 작성 가능

✅ 댓글 CRUD

<img src='https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/867972bd-931d-44a8-abcb-3340ab0c5a53' width='300px' height='200px' />

- 댓글 추가
- 댓글 수정
- 댓글 삭제
- 사용자별 프로필 사진 & 닉네임 로드

✅ 404 페이지

<img src='https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/a9f95b61-a7cc-42d8-b2d3-906b109d1232' width='300px' height='200px' />

- 에러 상태 공지
- 돌아가기 버튼 추가

# 🚢 화면 설계서

![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/95282021/4f9d5688-f4c7-48f0-a73c-3e9aadfbc5c1)

# 🎨 와이어 프레임

[Figma](https://www.figma.com/file/wiiwMEqh7oAivKKO2uwbLe/Skygrey-218's-team-library?type=design&node-id=0-1&mode=design&t=Ul65uyHVEweViBth-0)

![image](https://github.com/SesacProjectTeamA-2/pj-front/assets/86273626/3515f133-f7b3-4ecb-9e0b-0eb4d8f44503)

# 🗄️ ERD

- 신고기능을 위한 complain table 추가

[ERD](https://www.erdcloud.com/d/koATx2ojGQyH5Y62S)
![image](https://github.com/SesacProjectTeamA-2/pj-develop/assets/107044870/bee84bec-fb96-4ddb-9e2f-f75c7a893209)
