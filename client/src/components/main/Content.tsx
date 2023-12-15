// ============= 삭제 예정 ===============

import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import { Paper } from '@mui/material';

import Quotes from './Quotes';
import MainMission from './MainMission';
import MyPercentage from './MyPercentage';
import TeamPercentage from './TeamPercentage';

import '../../styles/scss/pages/main/percentage.scss';
import Progressbar from '../common/Progressbar';

export default function Content({
    setLoginData,
    loginData,
    newSocket,
    setInitialLogin,
    initialLogin,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    //_ loginData = {uSeq, uName, [gSeq]}
    // const [loginData, setLoginData] = useState<any>({
    //     uSeq: 1,
    //     uName: '',
    //     gSeq: [],
    // }); // socket 서버 전송
    const [uSeq, setUSeq] = useState(1); // 유저 번호
    const [gSeqList, setGSeqList] = useState<any>([]); // 참여 모임

    // 프로필 사진 , 명언 가져오기
    // -1) 프로필 사진
    const [userImgSrc, setUserImgSrc] = useState<string>(
        '/asset/images/user.svg'
    );

    // -2) 명언
    const [phraseCtt, setPhraseCtt] = useState<string | null>(null);

    // -3) 명언 지정 논리연산자
    //  데이터 가져와서 phrase null이 아니면 true로(자기 작성 모드) : Quotes 컨텐츠 가림
    //  null 이라면 false로 (명언 모드) : Quotes 컨텐츠 보임
    const [phraseModeSelf, setPhraseModeSelf] = useState<boolean>(false);

    // -4) 캐릭터 가져오기
    const [selectedCharacter, setSelectedCharacter] = useState<
        string | undefined
    >('/asset/images/sqr2.svg');

    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { userImg, phrase, character } = res.data;
                console.log(
                    'CONTENT 이미지 / 지정 명언 / 캐릭터',
                    userImg,
                    phrase,
                    character
                );
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
                    console.log('userImgSrc 없음', userImgSrc);
                }

                if (phrase) {
                    setPhraseModeSelf(true);
                    setPhraseCtt(phrase);
                    console.log('마이페이지 작성 => 가져온 명언', phraseCtt);
                    console.log('내가 쓴 명언인가 ? ', phraseModeSelf);
                }

                if (character !== null && character !== undefined) {
                    setSelectedCharacter(character);
                    console.log('character 있음', character);
                } else {
                    setSelectedCharacter('/asset/images/sqr1.svg');
                    console.log('character 없음', character);
                }
            });
    };
    useEffect(() => {
        if (cookie.get('isUser')) {
            getUserData();
        }
    }, []);

    //] 1. 유저 미션 조회
    const getMissionMain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/mission/user`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                // console.log('유저 미션 조회 >> ', res.data);

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
                const updatedGSeqList = [...gSeqList]; // 기존 배열을 복사

                for (let i = 0; i < groupInfo.length; i++) {
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
            });
    };

    useEffect(() => {
        if (cookie.get('isUser')) {
            getMissionMain();
        }
    }, []);

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
        if (cookie.get('isUser')) {
            getJoinedGroup();
        }
    }, []);

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
    }, []);

    const [madeGroupInfo, setMadeGroupInfo] = useState<any>([]);

    //=== 달성률에 따른 캐릭터 이미지 변경 ===

    let charNum = selectedCharacter?.slice(-5, -4); // 2

    let totalRates = 0;
    let totalPercent = 0;

    for (let i = 0; i < doneRates?.length; i++) {
        totalRates += doneRates[i];
        totalPercent = totalRates / doneRates?.length; // 평균
    }

    if (totalPercent > 70) {
        charNum = '1';
    } else if (totalPercent < 30) {
        charNum = '3';
    }

    let newChar =
        selectedCharacter?.slice(0, 17) +
        (charNum ?? '') +
        selectedCharacter?.slice(-4);

    // console.log('charNum', charNum);
    // console.log('newChar ::: ', newChar);
    // console.log('totalRates', totalRates);
    // console.log('totalPercent', totalPercent);

    useEffect(() => {
        setSelectedCharacter(newChar);
    }, [totalPercent]);

    //=== 채팅 login ===

    //? axios 사용
    // const getChat = async () => {
    //     const res = await axios
    //         .get(`${process.env.REACT_APP_DB_HOST}/chat`, {
    //             headers: {
    //                 Authorization: `Bearer ${uToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             const socket = io(`${process.env.REACT_APP_DB_HOST}/chat`);

    //             console.log('????????', res);

    //             socket.emit('connection', () => {
    //                 console.log('socket server connected.');
    //             });
    //         });
    // };

    //_ loginData = {uSeq, uName, [gSeq]}
    // console.log('uName::::::', uName);
    // console.log('uSeq::::::', uSeq);
    // console.log('groupInfo::::::', groupInfo);
    // console.log('gSeqList::::::', gSeqList);
    // console.log('loginData::::::', loginData);

    useEffect(() => {
        if (
            newSocket &&
            loginData.uSeq !== 0 &&
            loginData.uName !== '' &&
            loginData.uName !== undefined &&
            !initialLogin
        ) {
            newSocket.emit('login', loginData);

            newSocket.on('loginSuccess', (data: any) => {
                console.log('loginSuccess !!!!!!!!!!', data.msg); // Log the success message
            });

            setInitialLogin(true);
        }
    }, [loginData]);

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
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
                            color="#ed8d8d"
                        >
                            My 달성률{' '}
                        </div>

                        <div className="progress-img-flex">
                            <div className="progress-bar-div">
                                {groupArray?.map((group: any, idx: number) => {
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
                                                style={{ width: '10vw' }}
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
                                                    score={doneRates[idx]}
                                                    bg={'#f3f3f3'}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div
                                className="my-progress-img-background"
                                style={{ margin: '10px' }}
                            >
                                <img
                                    src={selectedCharacter}
                                    alt="동물 이미지"
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
    );
}
