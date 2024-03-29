import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { io } from 'socket.io-client';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { grey } from '@mui/material/colors';
import { Button, ButtonGroup, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../styles/scss/layout/header.scss';
import Alarm from './Alarm';

export default function Header(props: any) {
    const [isCookie, setIsCookie] = useState(false); // 쿠키 유무

    // console.log('socket 여부 >>>>>> ', props.socket);
    // console.log('sse 여부 ------> ', props.sse);

    const cookie = new Cookies();
    const uToken = cookie.get('isUser'); // 토큰 값

    const [isActive, setIsActive] = useState('main');

    const mainActiveHandler = () => {
        setIsActive('main');
    };

    const groupActiveHandler = () => {
        setIsActive('group');
    };

    const adminActiveHandler = () => {
        setIsActive('admin');
    };

    // console.log('adminUser', props.adminUser);

    //++ 연결 끊어졌을 경우, 재연결
    //-- 1. socket
    useEffect(() => {
        if (!props.socket) {
            const newSocket = io(`${process.env.REACT_APP_DB_HOST}/chat`, {
                path: '/socket.io',
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000, // 1초 간격으로 재시도
                reconnectionDelayMax: 5000, // 최대 5초 간격으로 재시도
                extraHeaders: {
                    Authorization: `Bearer ${uToken}`,
                },
            });

            props.setSocket(newSocket);
        }
    }, [props.socket]);

    // -- 2. sse
    useEffect(() => {
        if (!props.sse) {
            const eventSource = new EventSourcePolyfill(
                `${process.env.REACT_APP_DB_HOST}/subscribe/alarming`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                    heartbeatTimeout: 120000,
                }
            );

            props.setSse(eventSource);

            //-- 연결
            eventSource.addEventListener('connected', (e: any) => {
                console.log('sse connected :::', e);
            });
        }
    }, [props.sse]);

    const updateUnreadMsg = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/mission/user`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { groupInfo } = res.data;

                let updatedGSeqList: any = [];

                for (let i = 0; i < groupInfo?.length; i++) {
                    updatedGSeqList.push(groupInfo[i].gSeq);
                }

                setGSeqList(updatedGSeqList);

                // console.log('newMsg---updatedGSeqList', updatedGSeqList);
                // console.log('newMsg---gSeqList', gSeqList);

                //; localStorage 합산
                let accumulatedUnreadMsg = 0;

                for (let i = 0; i < updatedGSeqList?.length; i++) {
                    const currentUnreadMsg = localStorage.getItem(
                        `gSeq${updatedGSeqList[i]}`
                    );
                    const parsedUnreadMsg = parseInt(
                        currentUnreadMsg || '0',
                        10
                    );
                    accumulatedUnreadMsg += parsedUnreadMsg;
                    // console.log('currentUnreadMsg', currentUnreadMsg);
                    // console.log('parsedUnreadMsg', parsedUnreadMsg);
                    // console.log('accumulatedUnreadMsg', accumulatedUnreadMsg);
                }

                setUnreadMsg(accumulatedUnreadMsg);

                // console.log('accumulatedUnreadMsg', accumulatedUnreadMsg);
            });
    };

    //] 최신 메세지 가져오기
    //_ newMsg 최신 메세지 받아오면 실행 X
    const getRecentMsg = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/chat/roomInfo`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data.roomInfoArray);
                const { roomInfoArray } = res.data;

                // 시간 변환
                const formattedData = roomInfoArray?.map((msgObj: any) => ({
                    ...msgObj,
                    msg: {
                        ...msgObj.msg,
                        timeStamp: new Date(
                            msgObj.msg.timeStamp
                        ).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        }),
                    },
                }));

                props.setRecentMsg(formattedData);
            });
    };

    //] 실시간으로 채팅 메세지 오면 업데이트
    //_ newMsg 최신 메세지 받아오면 실행 O
    useEffect(() => {
        const socketNewMsg = (newMsgData: any) => {
            const gSeq = newMsgData.gSeq;
            const content = newMsgData.content; // 최신 메세지 내용, 시간

            const formattedData = {
                ...content,
                timeStamp: new Date(content.timeStamp).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }),
            };

            // console.log('newMsg Event newMsgData ::::', newMsgData);
            // console.log('newMsg Event gSeq, content ::::', gSeq, content);

            // console.log('formattedData', formattedData);

            // console.log(
            //     '+++++++newMsg - props.allGroupInfo>>>>>>>',
            //     props.allGroupInfo
            // );

            //; 최신순으로 allGroupInfo 정렬
            //) 주의할 점 ! --> newMsgData는 배열이 아닌, 객체 형태 (하나만 전송)
            //) ChatList에서의 getRecentMsg axios와 다릅니다 !
            // const newMsgData = {
            //     gSeq: 1,
            //     content: {
            //         msg: 'haha',
            //         timeStamp: '2023-12-30T07:02:47.085Z',
            //         uName: 'TTTest222222',
            //     },
            // };
            //--> props.allGroupInfo에서 newMsgData를 무조건 제일 위에 정렬 !!!
            // if (props.allGroupInfo?.length > 0) {
            const sortedAllGroupInfo = [...props.allGroupInfo].sort((a, b) => {
                return a.gSeq === newMsgData.gSeq
                    ? -1
                    : b.gSeq === newMsgData.gSeq
                    ? 1
                    : 0;
            });

            props.setAllGroupInfo(sortedAllGroupInfo);

            // 정렬된 allGroupInfo
            // console.log(
            //     'newMsg - sortedAllGroupInfo>>>>>>>',
            //     sortedAllGroupInfo
            // );
            // }

            const foundItem = props.recentMsg.find(
                (item: any) => item.gSeq === gSeq
            );

            if (foundItem) {
                props.setRecentMsg((prevRecentMsg: any) =>
                    prevRecentMsg?.map((item: any) =>
                        item.gSeq === gSeq
                            ? [...item, { gSeq, msg: formattedData }]
                            : item
                    )
                );
            } else {
                props.setRecentMsg((prevRecentMsg: any) => [
                    ...prevRecentMsg,
                    { gSeq, msg: formattedData },
                ]);
            }

            console.log('formattedData*****', formattedData);

            console.log('isEnter', props.isEnter);

            //; 새로운 메세지 왔을 경우, +1 count
            // isEnter 채팅방 입장 시에는, 읽고 있는거니까 미확인 메세지 개수 0으로 설정
            if (props.isEnter) {
                // console.log('l>>>>>>>', localStorage.getItem(`gSeq${gSeq}`));

                localStorage.setItem(`gSeq${gSeq}`, '0');
            } else {
                console.log('??????', gSeq);
                let currentCount = localStorage.getItem(`gSeq${gSeq}`);
                let newCount = Number(currentCount) + 1;
                localStorage.setItem(`gSeq${gSeq}`, newCount.toString());
            }

            //; localStorage 합산
            updateUnreadMsg();
        };

        props.socket?.on('newMsg', socketNewMsg);

        /////////////////////////////////

        const loginUserSocket = (data: any) => {
            console.log('loginUser #########', data); // 서버에서 보낸 data

            if (data.loginUser?.length > 0) {
                props.setLoginUser(data.loginUser);
            }
        };

        props.socket?.on('loginUser', loginUserSocket);
        return () => {
            props.socket?.off('newMsg', socketNewMsg);
            props.socket?.off('loginUser', loginUserSocket);
        };
    }, [props.socket, props.allGroupInfo, props.isEnter, props.recentMsg]);

    console.log('props.recentMsg:::::', props.recentMsg);

    useEffect(() => {
        getRecentMsg(); // axios
        //_ newMsg 최신 메세지 받아오면 실행 X
    }, [props.socket]);

    // 1. 실시간 메세지 개수 -> Header : 채팅 알람 개수
    // 2. 실시간 메세지 내용 -> ChatList

    // 처음에 채팅창 켤 때 - roomInfo data
    // 채팅방 나갈 때 - roomInfo data
    // 이후에는 - newMsg
    //--> recentMsg

    const nvg = useNavigate();

    const [uSeqData, setUSeqData] = useState({ uSeq: 0, gSeq: [] });

    //] 프로필 사진 가져오기
    const [userImgSrc, setUserImgSrc] = useState<any>('/asset/images/user.svg'); // 문자열 변수

    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { userImg } = res.data; //null
                if (userImg !== null && userImg !== undefined) {
                    // user가 업로드한 값이 있을 때
                    setUserImgSrc(userImg);
                } else {
                    // user가 업로드한 값이 없거나 undefined일 때
                    setUserImgSrc('/asset/images/user.svg');
                }
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    //] 로그인 여부 구분해 사진 넣기
    const [isUser, setIsUser] = useState<boolean>(false); // 비로그인 상태

    //] Login
    useEffect(() => {
        if (cookie.get('isUser')) {
            setIsCookie(true);

            const loginProfileLoad = async () => {
                setIsUser(true); //로그인 상태
                await getUserData();
            };

            loginProfileLoad();
        } else setIsCookie(false);
    }, [cookie]);

    //] 로그아웃 시, gSeqList 전송
    // --> localStorage 채팅방 모임 리스트 전체 삭제
    const [gSeqList, setGSeqList] = useState<any>([]); // 참여 모임

    //] localStorage 합산 (미확인 메세지 수)
    //--> gSeqList 활용
    const [unreadMsg, setUnreadMsg] = useState(0);

    // logout 시, uSeqData 업데이트 이후 ---> socket의 logout 이벤트에 담아, 서버에 전송하기 위해 사용
    const [updated, setUpdated] = useState(false);

    //; logout 시 실행
    const getMissionMain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/mission/user`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                // console.log('유저 미션 조회 >> ', res.data);

                const { groupInfo, uSeq } = res.data;

                let updatedGSeqList: any = [];

                for (let i = 0; i < groupInfo?.length; i++) {
                    updatedGSeqList.push(groupInfo[i].gSeq);
                }

                setGSeqList(updatedGSeqList);

                console.log('updatedGSeqList', updatedGSeqList);

                setUSeqData({ uSeq, gSeq: updatedGSeqList });

                updatedGSeqList?.map((gSeq: any) => {
                    localStorage.removeItem(`gSeq${gSeq}`);
                });

                setUpdated(true);
            });
    };

    useEffect(() => {
        updateUnreadMsg();
    }, [props.socket, props.isEnter]);

    const [logoutConfirm, setLogoutConfirm] = useState(false);

    //] 로그아웃
    const logoutHandler = () => {
        // [추후] 로그아웃 모달창 처리

        //; 1. 관리자
        if (localStorage.getItem('adminUser') === 'true') {
            if (window.confirm('로그아웃하시겠습니까 ?')) {
                // console.log('uSeqData ::::::', uSeqData);

                props.setAdminUser(false);
                localStorage.removeItem('adminUser');

                nvg('/login');
            } else {
                return;
            }
        } else {
            //; 2. 유저
            if (window.confirm('로그아웃하시겠습니까 ?')) {
                //-- 0) 채팅창 끄기
                props.setShowChat(false);
                // 로컬 스토리지에 값을 저장하기
                localStorage.setItem('showChat', JSON.stringify(false));

                console.log('********** uSeqData **********', uSeqData);

                // console.log('********** updatedGSeqList **********', gSeqList);

                // [임시] 주석처리
                // props.socket?.emit('joinRoom', {
                //     isSignup: false,
                //     gSeq: gSeqList,
                // });

                // // [추후] 제거해도 무방 확인
                // //-- loginUser 이벤트에 대한 리스너 추가
                // props.socket?.on('loginUser', (data: any) => {
                //     if (data.loginUser?.length > 0) {
                //         props.setLoginUser(data.loginUser);
                //     }
                // });

                localStorage.setItem('showChat', JSON.stringify(false));

                //-- 2) 로컬스토리지 삭제
                // localStorage.removeItem(`gSeq${gSeq}`);

                // logout 확정
                setLogoutConfirm(true);
            } else {
                return;
            }
        }
    };

    const postLogOut = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/logout`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);

                cookie.remove('isUser', { path: '/' });

                nvg('/');
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    //; 로그아웃 확정되면
    useEffect(() => {
        if (logoutConfirm) {
            getMissionMain(); //--> localStorage 채팅방 모임 리스트 전체 삭제

            postLogOut();
        }
    }, [logoutConfirm]);

    //_ logout 시, socket의 logout 이벤트에 uSeqData 업데이트하여 전송
    useEffect(() => {
        if (updated) {
            console.log('********** uSeqData **********', uSeqData);
            //-- 1) 채팅 종료
            props.socket?.emit('logout', uSeqData);
            // props.socket.emit('logout', { uSeq: 8 });

            //-- 3) 실시간 알람 종료
            props.sse?.addEventListener('close', (event: any) => {
                console.log('logout >>> 실시간 알람 종료');
                // props.sse.close();
            });
        }
    }, [updated]);

    //] 초대장 링크 입력 후 버튼 클릭 시 그 그룹으로 이동
    const [grpInput, setGrpInput] = useState<string>('');
    const grpInputObj = {
        gLink: grpInput,
    };
    const goInvited = (): void => {
        axios
            .post(
                `${process.env.REACT_APP_DB_HOST}/group/joinByLink`,
                grpInputObj,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                const { success, msg } = res.data;
                success
                    ? toast.success(msg, {
                          duration: 2000,
                      })
                    : toast.error(msg, {
                          duration: 2000,
                      });
                setGrpInput('');
            });
    };

    //++ 알람 SSE
    const [isAlarm, setIsAlarm] = useState<boolean>(false);
    const alarmHandler = () => {
        setIsAlarm(!isAlarm);
    };

    //; 초기 로그인 Main에서 sse 관련 모든 이벤트 수행

    //-- 컴포넌트가 마운트될 때 EventSource 생성
    // useEffect(() => {
    //     if (isAlarm) {
    //         // getNoti();
    //     }
    // }, [isAlarm]);

    //_ [ START ] 반응형 CSS
    const theme = createTheme({
        palette: {
            primary: {
                main: grey[200],
            },
            secondary: grey,
        },
    });

    // 리사이즈 이벤트에 따라 너비값 측정
    // const [myWidth, setMyWidth] = useState<number>(window.innerWidth);

    // // window.onresize = () => {
    // //     setMyWidth(window.innerWidth);
    // // };

    // // 헤더 메뉴 보여주기
    const [isVisibleMobile, setIsVisibleMobile] = useState<boolean>(true);
    const toggleVal = (): void => {
        // if (myWidth < 800) {
        setIsVisibleMobile((prev) => !prev);
        // }
    };

    // useEffect(() => {
    //     const handleResize = (): void => {
    //         setMyWidth(window.innerWidth);
    //     };

    //     // 컴포넌트가 마운트되었을 때 리사이즈 이벤트 리스너 추가
    //     window.addEventListener('resize', handleResize);

    //     // 컴포넌트가 언마운트되면 리사이즈 이벤트 리스너 제거
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []); // 빈 배열을 전달하여 마운트 및 언마운트 시에만 실행되도록 함
    //_ [ END ]

    // console.log('********** uSeqData **********', uSeqData);

    return (
        <>
            <div className="header-blur">
                <div className="header-container">
                    {/* 로고 */}
                    {localStorage.getItem('adminUser') === 'true' ? (
                        <div
                            className="header-divOne"
                            style={{ zIndex: '0', height: '120px' }}
                        >
                            <div className="title1 logo-text">MOTI</div>
                        </div>
                    ) : (
                        <div
                            className="header-divOne"
                            style={{ zIndex: '0', height: '120px' }}
                        >
                            <Link to="/">
                                <div className="title1 logo-text">MOTI</div>
                            </Link>
                        </div>
                    )}

                    {/* // === admin === */}
                    {/* {localStorage.getItem('adminUser') === 'true' ? (
                        <div
                            className="
                        admin-welcome-text"
                        >
                            Welcome to Dashboard
                        </div>
                    ) : (
                        <></>
                    )} */}

                    {/* 회원가입 페이지 */}
                    {props.isJoinPage ? (
                        ''
                    ) : (
                        <div className="header-divTwo pcMode">
                            <nav className="header-nav ">
                                {localStorage.getItem('adminUser') ===
                                'true' ? (
                                    <div
                                        style={{
                                            color: 'gray',
                                            padding: '0 2rem',
                                        }}
                                    >
                                        관리자로 로그인하셨습니다.
                                    </div>
                                ) : isCookie ? (
                                    // ===login한 경우만 초대링크 ===
                                    <>
                                        {' '}
                                        <input
                                            type="text"
                                            id="grpSearch-input"
                                            value={grpInput}
                                            placeholder="초대 링크를 넣어보세요"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setGrpInput(e.target.value)}
                                        />
                                        <img
                                            src="/asset/icons/search.svg"
                                            id="grpSearch-btn"
                                            onClick={(e: React.MouseEvent) =>
                                                goInvited()
                                            }
                                            alt="search"
                                        ></img>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <div id="navbar-animmenu">
                                    <ul className="show-dropdown main-navbar">
                                        <div className="hori-selector">
                                            <div className="left"></div>
                                            <div className="right"></div>
                                        </div>
                                        {props.isIntro || props.isLogin ? (
                                            <div className="menu-list-btn">
                                                <li onClick={mainActiveHandler}>
                                                    <Link
                                                        to="/main"
                                                        style={{
                                                            color: 'black',
                                                        }}
                                                    >
                                                        Main
                                                    </Link>
                                                </li>
                                                <li
                                                    onClick={groupActiveHandler}
                                                >
                                                    <Link
                                                        to="/group"
                                                        style={{
                                                            color: 'black',
                                                        }}
                                                    >
                                                        Group
                                                    </Link>
                                                </li>

                                                {props.adminUser ? (
                                                    <li
                                                        onClick={
                                                            adminActiveHandler
                                                        }
                                                    >
                                                        <Link to="/management">
                                                            {/* <Button className="menu-button">
                                                                Management
                                                            </Button> */}
                                                            {/* <div className="menu-button">
                                                                Management
                                                            </div> */}
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ) : (
                                            <div className="menu-list-btn">
                                                {/* {props.adminUser ? ( */}
                                                {localStorage.getItem(
                                                    'adminUser'
                                                ) === 'true' ? (
                                                    // === admin 경우 ===
                                                    <li
                                                        onClick={
                                                            adminActiveHandler
                                                        }
                                                    >
                                                        {/* <Link to="/management">
                                                            <Button className="menu-button">
                                                                Management
                                                            </Button> 
                                                        </Link> */}
                                                    </li>
                                                ) : (
                                                    <>
                                                        <li
                                                            onClick={
                                                                mainActiveHandler
                                                            }
                                                        >
                                                            <Link
                                                                to="/main"
                                                                style={{
                                                                    color:
                                                                        isActive ===
                                                                        'main'
                                                                            ? 'black'
                                                                            : '',
                                                                }}
                                                            >
                                                                Main
                                                            </Link>
                                                        </li>
                                                        <li
                                                            onClick={
                                                                groupActiveHandler
                                                            }
                                                        >
                                                            <Link
                                                                to="/group"
                                                                style={{
                                                                    color:
                                                                        isActive ===
                                                                        'group'
                                                                            ? 'black'
                                                                            : '',
                                                                }}
                                                            >
                                                                Group
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </ul>
                                </div>
                                {/* <ButtonGroup
                                    aria-label="outlined button group"
                                    variant="outlined"
                                    sx={{ p: 1 }}
                                >
                                    <Link to="/main">
                                        <Button className="menu-button">
                                            MAIN
                                        </Button>
                                    </Link>

                                    <Link to="/group">
                                        <Button className="menu-button">
                                            GROUP
                                        </Button>
                                    </Link> */}
                                {/* </li> */}
                                {/* </ButtonGroup> */}
                                {/* </ThemeProvider> */}
                                <ul className="menu">
                                    {!isCookie ? (
                                        // props.adminUser ? (
                                        localStorage.getItem('adminUser') ===
                                        'true' ? (
                                            // === admin 경우 ===
                                            <li>
                                                <ThemeProvider theme={theme}>
                                                    {/* <Link to="/login">Login</Link> */}

                                                    {/* <Link to="/login"> */}
                                                    <Button
                                                        aria-label="outlined button group"
                                                        variant="outlined"
                                                        className="menu-button"
                                                        onClick={logoutHandler}
                                                    >
                                                        Logout
                                                    </Button>
                                                    {/* </Link> */}
                                                </ThemeProvider>
                                            </li>
                                        ) : (
                                            // === 비로그인 시 ===
                                            <li>
                                                <ThemeProvider theme={theme}>
                                                    {/* <Link to="/login">Login</Link> */}

                                                    <Link to="/login">
                                                        <Button
                                                            aria-label="outlined button group"
                                                            variant="outlined"
                                                            className="menu-button"
                                                            style={{
                                                                color: 'black',
                                                            }}
                                                        >
                                                            Login
                                                        </Button>
                                                    </Link>
                                                </ThemeProvider>
                                            </li>
                                        )
                                    ) : (
                                        <>
                                            {!props.isIntro && (
                                                <div className="chat-icon-container">
                                                    <img
                                                        src="/asset/icons/chat.svg"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                        }}
                                                        alt="chatImg"
                                                        onClick={() =>
                                                            props.showChatting()
                                                        }
                                                        id="chat-btn"
                                                    />
                                                    <div
                                                        className="noti-chat-count-wrapper"
                                                        onClick={() =>
                                                            props.showChatting()
                                                        }
                                                    >
                                                        {/* 0이면 span 없게 처리 */}
                                                        {unreadMsg == 0 ? (
                                                            <></>
                                                        ) : (
                                                            <span className="notification-chat-count">
                                                                {/* 합산 */}
                                                                {unreadMsg}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span id="chat-text">
                                                        Chat
                                                    </span>
                                                </div>
                                            )}

                                            <div className="alarm-icon-container">
                                                <img
                                                    src="/asset/icons/Bell.svg"
                                                    alt="alarm"
                                                    onClick={alarmHandler}
                                                    id="alarm-btn"
                                                />
                                                <div
                                                    className="noti-count-wrapper"
                                                    onClick={alarmHandler}
                                                >
                                                    {props.alarmCount ===
                                                    '0' ? (
                                                        ''
                                                    ) : (
                                                        <span className="notification-count">
                                                            {Number(
                                                                props.alarmCount
                                                            ) < 100
                                                                ? props.alarmCount
                                                                : '99+'}
                                                        </span>
                                                    )}
                                                </div>
                                                <span id="alarm-text">
                                                    Alarm
                                                </span>
                                            </div>
                                            {/* 알람창 컴포넌트 */}

                                            {isAlarm && (
                                                <Alarm
                                                    alarmHandler={alarmHandler}
                                                    alarmList={props.alarmList}
                                                    setAlarmList={
                                                        props.setAlarmList
                                                    }
                                                    commentAlarm={
                                                        props.commentAlarm
                                                    }
                                                    setAlarmCount={
                                                        props.setAlarmCount
                                                    }
                                                    setKey={props.setKey}
                                                    // key={props.key}
                                                />
                                            )}

                                            {/* [참고] 움직이는 알람 */}
                                            {/* <div className="notification-box">
                                            <span className="notification-count">
                                                6
                                            </span>
                                            <div className="notification-bell">
                                                <span className="bell-top"></span>
                                                <span className="bell-middle"></span>
                                                <span className="bell-bottom"></span>
                                                <span className="bell-rad"></span>
                                            </div>
                                        </div> */}

                                            <div className="logout-icon-container">
                                                <img
                                                    src="/asset/icons/logout.svg"
                                                    alt="logout"
                                                    onClick={logoutHandler}
                                                    id="logout-btn"
                                                />
                                                <span id="logout-text">
                                                    Logout
                                                </span>
                                            </div>

                                            <li>
                                                {/* <div className="mypage-icon-container"> */}
                                                <Link to="/mypage">
                                                    <img
                                                        src={userImgSrc}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                        }}
                                                        alt="userImg"
                                                        className="myPage-btn"
                                                    />
                                                </Link>

                                                {/* <span id="mypage-text">My</span>
                                            </div> */}
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    )}

                    {/* 메뉴 탭 버튼 */}
                    <div className="tab-menu-div">
                        <button id="tab-menu-btn" onClick={() => toggleVal()}>
                            <img src="/asset/icons/Menu.svg" alt="tabMenu" />
                        </button>
                    </div>
                </div>

                {/* ======  모바일일 때 메뉴 바 ====== */}
                <div className="header-divTwo mobMode">
                    <nav className="header-nav ">
                        <ul
                            className="menu"
                            style={{
                                display: isVisibleMobile ? 'flex' : 'none',
                            }}
                        >
                            {/* 회원가입 페이지 */}

                            {/* 로그인/비로그인 구분 */}
                            {!isCookie ? (
                                // props.adminUser ? (
                                localStorage.getItem('adminUser') === 'true' ? (
                                    // === admin 경우 ===
                                    <li>
                                        <ThemeProvider theme={theme}>
                                            {/* <Link to="/login">Login</Link> */}

                                            <Link to="/login">
                                                <Button
                                                    aria-label="outlined button group"
                                                    variant="outlined"
                                                    className="menu-button"
                                                    onClick={logoutHandler}
                                                >
                                                    Logout
                                                </Button>
                                            </Link>
                                        </ThemeProvider>
                                    </li>
                                ) : (
                                    <li>
                                        {/* 비로그인 시 */}
                                        <Link to="/login">
                                            <button className="menu-button">
                                                Login
                                            </button>
                                        </Link>
                                    </li>
                                )
                            ) : (
                                <>
                                    <li>
                                        <Link to="/main">
                                            <button className="menu-button">
                                                MAIN
                                            </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/group">
                                            <button className="menu-button">
                                                GROUP
                                            </button>
                                        </Link>
                                    </li>
                                    {!props.isIntro && (
                                        <div className="chat-icon-container">
                                            <img
                                                src="/asset/icons/chat.svg"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                                alt="chatImg"
                                                onClick={() =>
                                                    props.showChatting()
                                                }
                                                id="chat-btn"
                                            />
                                            <div
                                                className="noti-chat-count-wrapper"
                                                onClick={() =>
                                                    props.showChatting()
                                                }
                                            >
                                                {unreadMsg == 0 ? (
                                                    <></>
                                                ) : (
                                                    <span className="notification-chat-count">
                                                        {/* 합산 */}
                                                        {unreadMsg}
                                                    </span>
                                                )}
                                            </div>
                                            <span id="chat-text">Chat</span>
                                        </div>
                                    )}

                                    <div className="alarm-icon-container">
                                        <img
                                            src="/asset/icons/Bell.svg"
                                            alt="alarm"
                                            onClick={alarmHandler}
                                            id="alarm-btn"
                                        />
                                        <div
                                            className="noti-count-wrapper"
                                            onClick={alarmHandler}
                                        >
                                            {props.alarmCount === '0' ? (
                                                ''
                                            ) : (
                                                <span className="notification-count">
                                                    {Number(props.alarmCount) <
                                                    100
                                                        ? props.alarmCount
                                                        : '99+'}
                                                </span>
                                            )}
                                        </div>
                                        <span id="alarm-text">Alarm</span>
                                    </div>

                                    {isAlarm && (
                                        <Alarm
                                            alarmHandler={alarmHandler}
                                            alarmList={props.alarmList}
                                            setAlarmList={props.setAlarmList}
                                            commentAlarm={props.commentAlarm}
                                            setAlarmCount={props.setAlarmCount}
                                            setKey={props.setKey}
                                            // key={props.key}
                                        />
                                    )}

                                    <div className="logout-icon-container">
                                        <img
                                            src="/asset/icons/logout.svg"
                                            alt="logout"
                                            onClick={logoutHandler}
                                            id="logout-btn"
                                        />
                                        <span id="logout-text">Logout</span>
                                    </div>
                                    <li>
                                        {/* <div className="mypage-icon-container"> */}
                                        <Link to="/mypage">
                                            <img
                                                src={userImgSrc}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                                alt="userImg"
                                                className="myPage-btn"
                                            />
                                        </Link>
                                    </li>
                                    {/* <li
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    > */}
                                    {/* 로그인 시 */}
                                    {/* 모바일에서 - 채팅 컴포넌트 */}
                                    {/* <li id="chat-li"> */}
                                    {/* <img
                                            src="/asset/icons/chat.svg"
                                            alt="chatImg"
                                            onClick={() => props.showChatting()}
                                            id="chat-btn"
                                        /> */}
                                    {/* </li> */}
                                    {/* <img
                                            src="/asset/icons/logout.svg"
                                            alt="logout"
                                            onClick={logoutHandler}
                                            id="logout-btn"
                                        />
                                        <Link to="/mypage">
                                            <img
                                                src={userImgSrc}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                                className="myPage-btn"
                                                alt="userImg"
                                            ></img>
                                        </Link> */}
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
