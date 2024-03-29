import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { EventSourcePolyfill } from 'event-source-polyfill';

import Content from '../components/main/Content';
import MainMission from 'src/components/main/MainMission';

import { Paper } from '@mui/material';

import Quotes from '../components/main/Quotes';

import '../styles/scss/pages/main/percentage.scss';
import Progressbar from '../components/common/Progressbar';

let newSocket: Socket | null = null;

export default function Main({
    initialLogin,
    setInitialLogin,
    setSocket,
    setSse,
    setAlarmCount,
    setAlarmList,
    setCommentAlarm,
    setKey,
    socket,
    loginUser,
    setLoginUser,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [loginData, setLoginData] = useState<any>({
        uSeq: 0,
        uName: '',
        gSeq: [],
    }); // socket 서버 전송

    const [uSeq, setUSeq] = useState(1); // 유저 번호
    const [gSeqList, setGSeqList] = useState<any>([]); // 참여 모임

    // 1. 사용자 명언 정보 가져오기
    // 1) 명언 변수
    const [phraseCtt, setPhraseCtt] = useState<string | null>(null);

    // 2) 명언 지정 논리연산자
    // 데이터 가져와서 phrase null이 아니면 true로(자기 작성 모드) : Quotes 컨텐츠 가림
    //  null 이라면 false로 (명언 모드) : Quotes 컨텐츠 보임
    const [phraseModeSelf, setPhraseModeSelf] = useState<boolean>(false);

    // 프로필 사진 , 명언 가져오기
    // 3) 프로필 사진
    const [userImgSrc, setUserImgSrc] = useState<string>(
        '/asset/images/user.svg'
    );

    // 4) 캐릭터 가져오기
    const [selectedCharacter, setSelectedCharacter] = useState<
        string | undefined
    >('/asset/images/emo2.gif');

    useEffect(() => {
        // 2. 회원가입 url에서 user 정보 가져오기
        const curPath: string = window.location.href;
        const urlParams: any = new URLSearchParams(curPath);

        const uToken: string = urlParams.get('token');

        // 3. 쿠키 굽기
        let myCookie = new Cookies();
        if (uToken) {
            myCookie.set('isUser', uToken);

            //] 최초 로그인 시,
            //; 1. socket 연결 요청
            newSocket = io(`${process.env.REACT_APP_DB_HOST}/chat`, {
                path: '/socket.io',
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000, // 1초 간격으로 재시도
                reconnectionDelayMax: 5000, // 최대 5초 간격으로 재시도
                extraHeaders: {
                    Authorization: `Bearer ${uToken}`,
                },
            });

            setSocket(newSocket);

            //; 2. sse 연결 요청
            const eventSource = new EventSourcePolyfill(
                `${process.env.REACT_APP_DB_HOST}/subscribe/alarming`,
                {
                    heartbeatTimeout: 180000,
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            setSse(eventSource);

            //-- 연결
            eventSource.addEventListener('connected', (e: any) => {
                console.log('프론트 측 connect', e);

                // 알람 count 받아오기
                setAlarmCount(e.data);

                localStorage.setItem('alarmCount', e.data);
            });

            //-- 미확인 알람 전체 리스트
            eventSource.addEventListener('allAlarm', (event: any) => {
                console.log('alarmList ::::', event);
                // console.log('alarmList event.data ::::', event.data);

                try {
                    // 파싱 이후 alarmList 업데이트
                    const eventData = JSON.parse(event.data);

                    let updateData = [];
                    for (let i = 0; i < eventData.length; i++) {
                        updateData.push(JSON.parse(eventData[i]));
                    }

                    setAlarmList([...updateData]);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            });

            //-- 메세지
            eventSource.addEventListener(
                `commentAlarm${uSeq}`,
                (event: any) => {
                    // console.log('commentAlarm ::::', event);
                    // console.log('commentAlarm event.data ::::', event.data);

                    const eventData = JSON.parse(event.data);

                    let updateData = [];
                    for (let i = 0; i < eventData.length; i++) {
                        updateData.push(JSON.parse(eventData[i]));
                    }

                    setAlarmList([...updateData]);

                    // setCommentAlarm([...updateData]);

                    // key 값을 변경하여 리렌더링 유도
                    // setKey((prevKey: any) => prevKey + 1);

                    console.log('commentAlarm 이벤트 받아옴 >>>>>', uSeq);
                    // commentTime: '2023-12-29T02:34:19.680Z';
                    // gSeq: '3';
                    // gbSeq: '22';
                    // type: 'comment';
                    // uName: '테스트111111';

                    // setCommentAlarm(eventData);
                }
            );

            //-- 댓글 수신 시, 카운트 업데이트
            eventSource.addEventListener('alarmCount', (event: any) => {
                // console.log('commentAlarm ::::', event);
                // console.log('commentAlarm event.data ::::', event.data);

                const eventData = JSON.parse(event.data);

                console.log('alarmCount - eventData ::::', eventData);

                setAlarmCount(eventData);
                localStorage.setItem('alarmCount', eventData.toString());

                setAlarmCount(localStorage.getItem('alarmCount'));

                // key 값을 변경하여 리렌더링 유도
                // setKey((prevKey: any) => prevKey + 1);
            });

            //-- 모임 추방 시 알람
            eventSource.addEventListener('groupAlarm', (event: any) => {
                // console.log('commentAlarm ::::', event);
                // console.log('commentAlarm event.data ::::', event.data);

                const eventData = JSON.parse(event.data);

                console.log('groupAlarm - eventData ::::', eventData);

                // key 값을 변경하여 리렌더링 유도
                // setKey((prevKey: any) => prevKey + 1);
            });

            // console.log(':::::::::::: 최초 로그인 시");
        }
    }, []);

    //=== Contents API ===
    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { userImg, phrase, character } = res.data;

                if (
                    userImg !== '0' ||
                    userImg !== null ||
                    userImg !== undefined
                ) {
                    // 업로드한 이미지 있으면
                    setUserImgSrc(userImg);
                } else {
                    // user가 업로드한 값이 없거나 undefined일 때
                    setUserImgSrc('/asset/images/user.svg');
                    // console.log('userImgSrc 없음', userImgSrc);
                }

                if (phrase) {
                    setPhraseModeSelf(true);
                    setPhraseCtt(phrase);
                    // console.log('마이페이지 작성 => 가져온 명언', phraseCtt);
                    // console.log('내가 쓴 명언인가 ? ', phraseModeSelf);
                }

                if (character !== null && character !== undefined) {
                    setSelectedCharacter(character);
                    // console.log('character 있음', character);
                } else {
                    //++ 기본 캐릭터 이미지
                    setSelectedCharacter('/asset/images/hiEmo.gif');
                    // console.log('character 없음', character);
                }
            });
    };
    useEffect(() => {
        // if (cookie.get('isUser')) {
        getUserData();
        // }
    }, [uToken]);

    //] 1. 유저 미션 조회
    const getMissionMain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/mission/user`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('유저 미션 조회 >> ', res.data);

                const {
                    missionArray,
                    mainGroup,
                    groupInfo,
                    isDone,
                    groupArray,
                    doneRates,
                    nowScoreUserInfo,
                    nowRanking,
                    GroupRates,
                    uName,
                    uCharImg,
                } = res.data;

                setMissionArray(missionArray);
                setGroupInfo(groupInfo);
                setUName(uName);
                setCharImg(uCharImg);
                setIsDone(isDone);
                setDoneRates(doneRates);
                setGroupArray(groupArray);
                setNowScoreUserInfo(nowScoreUserInfo);
                setNowRanking(nowRanking);
                setGroupRates(GroupRates);
                setMainGroup(mainGroup);

                //-- gSeqList => 채팅 서버 전송
                // const updatedGSeqList = [...gSeqList]; // 기존 배열을 복사

                let updatedGSeqList: any = [];

                for (let i = 0; i < groupInfo?.length; i++) {
                    updatedGSeqList.push(groupInfo[i].gSeq);
                }

                setGSeqList(updatedGSeqList);

                //-- 보낼 데이터 업데이트
                // uSeq: 1,
                // uName: '',
                // gSeq: [],
                if (loginData.uName !== uName) {
                    setLoginData((prevData: any) => ({
                        ...prevData,
                        uName,
                        gSeq: [...updatedGSeqList],
                    }));
                }

                // console.log('groupInfo', groupInfo);
                // console.log('updatedGSeqList :::', updatedGSeqList);

                //-- local Storage에 'gSeq번호 : 메세지 개수' 형식으로 담음
                // { gSeq1: 3 }
                updatedGSeqList?.map((gSeq: any) => {
                    if (!localStorage.getItem(`gSeq${gSeq}`)) {
                        localStorage.setItem(`gSeq${gSeq}`, '0');
                    }
                });
            });
    };

    // console.log('gSeqList :::', gSeqList);

    useEffect(() => {
        // if (cookie.get('isUser')) {
        getMissionMain();
        // }
    }, [uToken]);

    const [uName, setUName] = useState('');
    const [mainGroup, setMainGroup] = useState('');
    const [uCharImg, setCharImg] = useState('');
    const [missionArray, setMissionArray] = useState([]);
    const [groupInfo, setGroupInfo] = useState<any>([]);
    const [groupArray, setGroupArray] = useState<any>([]);
    const [isDone, setIsDone] = useState([]);
    const [nowScoreUserInfo, setNowScoreUserInfo] = useState([]);
    const [nowRanking, setNowRanking] = useState([]);
    const [GroupRates, setGroupRates] = useState([]);
    const [doneRates, setDoneRates] = useState([]);

    // ] 2. 유저 가입 모임
    const getJoinedGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/joined`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { groupInfo, uSeq } = res.data;

                setJoinGroupInfo(groupInfo);
                setUSeq(uSeq);

                //-- 보낼 데이터 업데이트
                if (loginData.uSeq !== uSeq) {
                    setLoginData((prevData: any) => ({
                        ...prevData,
                        uSeq,
                    }));
                }
            });
    };

    useEffect(() => {
        // if (cookie.get('isUser')) {
        getJoinedGroup();
        // }
    }, [uToken]);

    const [madeJoinInfo, setJoinGroupInfo] = useState<any>([]);

    //] 3. 유저 생성 모임
    const getMadeGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/made`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { groupInfo } = res.data;

                setMadeGroupInfo(groupInfo);
            });
    };

    useEffect(() => {
        if (cookie.get('isUser')) {
            getMadeGroup();
        }
    }, [uToken]);

    const [madeGroupInfo, setMadeGroupInfo] = useState<any>([]);

    //_ 아래 코드 socket 이벤트가 안됨...
    useEffect(() => {
        if (
            socket &&
            loginData.uSeq !== 0 &&
            loginData.uName !== '' &&
            loginData.uName !== undefined &&
            !initialLogin
        ) {
            // console.log('=============', socket);
            socket?.emit('login', loginData);
            // socket?.emit('login', { gSeq: [1, 2, 3, 4] });

            socket?.on('loginSuccess', (data: any) => {
                console.log(
                    '!!!!!!!!!!!!!!!! loginSuccess !!!!!!!!!!',
                    data.msg
                ); // Log the success message
            });

            setInitialLogin(true);

            console.log('gSeqList######', gSeqList);

            //-- joinRoom 이벤트
            socket.emit('joinRoom', { gSeq: gSeqList });

            //-- loginUser 이벤트에 대한 리스너 추가
            socket?.on('loginUser', (data: any) => {
                if (data.loginUser?.length > 0) {
                    setLoginUser(data.loginUser);
                }
            });
        }
    }, [loginData]);

    //=== 달성률에 따른 캐릭터 이미지 변경 ===
    // let charNum = selectedCharacter?.slice(-5, -4); // 2
    let charNum = selectedCharacter?.slice(-5); // 2.svg
    // .jpeg

    let originChar = selectedCharacter?.slice(0, 17); // asset/images/emo

    console.log('originChar ::::::::', originChar);

    console.log('charNum', charNum);

    let totalRates = 0;
    let totalPercent = 0;
    let newChar = '';

    for (let i = 0; i < doneRates?.length; i++) {
        totalRates += doneRates[i];
        totalPercent = totalRates / doneRates?.length; // 평균
    }

    // let newChar =
    //     selectedCharacter?.slice(0, 17) +
    //     (charNum ?? '') +
    //     selectedCharacter?.slice(-4);

    // let newChar =
    //     selectedCharacter?.slice(0, 17) +
    //     (charNum ?? '') +
    //     selectedCharacter?.slice(-4);

    console.log('newChar ::: ', newChar);
    // console.log('totalRates', totalRates);
    // console.log('totalPercent', totalPercent);

    useEffect(() => {
        // setSelectedCharacter(newChar);

        if (totalPercent > 70) {
            // charNum = '1';
            // charNum = '1.gif';
            newChar = originChar + '1.gif';
            setSelectedCharacter(newChar);
        } else if (totalPercent < 30) {
            // charNum = '3';
            // charNum = '3.gif';
            newChar = originChar + '3.gif';
            setSelectedCharacter(newChar);
        }
    }, [totalPercent]);

    // 랜덤 색상을 선택하는 함수
    const getRandomColor = () => {
        const colors = [
            '#ff6d59',
            '#ffcc77',
            '#83cb77',
            '#ffa7cf',
            '#7fbeeb',
            '#fba261',
            '#b78be3',
            '#c4c4c4',
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <div className="section-main">
            {/* <Content setLoginData={setLoginData} loginData={loginData} /> */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <div className="content-grid">
                    <Quotes
                        phraseCtt={phraseCtt}
                        // setPhraseCtt={setPhraseCtt}
                        // setPhraseModeSelf={setPhraseModeSelf}
                        phraseModeSelf={phraseModeSelf}
                        uName={uName}
                    />
                    {/* 1. 명언 : 가로로 길게 */}

                    <br />

                    {/* 2. 달성률 : my, team */}
                    <Paper elevation={3} className="content-grid-box">
                        <div className="percentage-div">
                            <div
                                className="title4"
                                style={{ marginBottom: '10px' }}
                                color="#94897c"
                            >
                                My 달성률{' '}
                            </div>

                            <div className="progress-img-flex">
                                <div className="progress-bar-div">
                                    {groupArray?.map(
                                        (group: any, idx: number) => {
                                            return (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        padding: '1rem',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '10vw',
                                                        }}
                                                        className="title6"
                                                    >
                                                        {group.gName}
                                                    </div>
                                                    <div
                                                        className="bar-container"
                                                        style={{
                                                            display: 'flex',
                                                            width: '30vw',
                                                        }}
                                                    >
                                                        <Progressbar
                                                            score={
                                                                doneRates[idx]
                                                            }
                                                            bg={'#f3f3f3'}
                                                            barColor={getRandomColor()}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                <div
                                    className="my-progress-img-background"
                                    style={{ margin: '10px' }}
                                >
                                    <img
                                        src={selectedCharacter}
                                        alt="캐릭터"
                                        className="my-progress-img"
                                    />
                                </div>
                            </div>
                        </div>
                    </Paper>

                    <br />

                    {/* Team 달성률 */}
                    {/* [첨언] 시간 없으면 빼겠습니다. */}
                    {/* <div className="content-grid-box">
                <div className="percentage-div">
                    <div className="title4">Team 달성률</div>
                    {mainGroup ? (
                        <div>
                            {nowScoreUserInfo?.map((info: any, idx: number) => {
                                return (
                                    <>
                                        <div className="profile-img-div-flex">
                                            {info.uName}
                                        </div>
                                    </>
                                );
                            })}
                            {GroupRates?.map((mission: any, idx: number) => {
                                return (
                                    <div className="progress-bar-div">
                                        <Progressbar
                                            score={mission}
                                            bg={'#f3f3f3'}
                                        />
                                    </div>
                                );
                            })}
                            <div className="team-progress-img-div-flex">
                                <img
                                    src={userImgSrc}
                                    alt="프로필 이미지"
                                    className="profile-img"
                                />
                                <div className="title5">
                                    {groupArray[0].gName}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="title5">대표 모임을 설정해주세요</div>
                    )}
                    <div className="progress-img-flex">
                        <div className="progress-bar-div">
                            <div className="profile-img-div-flex">
                                멤버 리스트 동적 수정 */}
                    {/* <img
                                    src={userImgSrc || '/asset/images/user.svg'}
                                    alt="프로필 이미지"
                                    className="profile-img"
                                />
                            </div>

                            <div className="progress-bar-flex">
                                <div>
                                    <div className="progress-div">
                                        <div className="my-progress">
                                            <div className="my-bar-one"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

                    <br />

                    <MainMission />
                </div>
            </div>
        </div>
    );
}
