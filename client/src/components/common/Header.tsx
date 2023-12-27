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

    console.log('socket 연결 여부  >>>>>> ', props.socket);
    console.log('sse 연결 여부 ------> ', props.sse);

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

    console.log('adminUser', props.adminUser);

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
    }, []);

    //-- 2. sse
    // useEffect(() => {
    //     if (!props.sse) {
    //         const eventSource = new EventSourcePolyfill(
    //             `${process.env.REACT_APP_DB_HOST}/subscribe/alarming`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${uToken}`,
    //                 },
    //                 heartbeatTimeout: 120000,
    //             }
    //         );

    //         props.setSse(eventSource);

    //         //-- 연결
    //         eventSource.addEventListener('connected', (e: any) => {
    //             console.log('sse connected :::', e);
    //         });
    //     }
    // }, []);

    const nvg = useNavigate();

    const [uSeqData, setUSeqData] = useState({ uSeq: 0 });

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

    // ] disconnect 시, uSeq 데이터 전송
    const getJoinedGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/joined`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { uSeq } = res.data;

                setUSeqData({
                    uSeq,
                });
            });
    };

    useEffect(() => {
        getJoinedGroup(); // uSeq 데이터 update
    }, []);

    const [logoutConfirm, setLogoutConfirm] = useState(false);

    //] 로그아웃
    const logoutHandler = () => {
        // [추후] 로그아웃 모달창 처리

        //; 1. 관리자
        if (props.adminUser) {
            if (window.confirm('로그아웃하시겠습니까 ?')) {
                // console.log('uSeqData ::::::', uSeqData);

                //-- 채팅 종료
                // props.socket?.emit('logout', uSeqData);
                // props.socket.emit('logout', { uSeq: 8 });

                props.setAdminUser(false);

                nvg('/login');
            } else {
                return;
            }
            //; 2. 유저
        } else if (window.confirm('로그아웃하시겠습니까 ?')) {
            // console.log('uSeqData ::::::', uSeqData);

            //-- 0) 채팅창 끄기
            props.setShowChat(false);
            // 로컬 스토리지에 값을 저장하기
            localStorage.setItem('showChat', JSON.stringify(false));

            //-- 1) 채팅 종료
            props.socket?.emit('logout', uSeqData);
            // props.socket.emit('logout', { uSeq: 8 });

            localStorage.setItem('showChat', JSON.stringify(false));

            //-- 2) 실시간 알람 종료
            props.sse?.addEventListener('close', (event: any) => {
                console.log('logout >>> 실시간 알람 종료');
                // props.sse.close();
            });

            // logout 확정
            setLogoutConfirm(true);
        } else {
            return;
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

    useEffect(() => {
        if (logoutConfirm) {
            postLogOut();
        }
    }, [logoutConfirm]);

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

    // const getNoti = () => {
    //     // console.log('***********', props.sse);

    //     if (props.sse) {
    //         //~ 콘솔이 안찍힘 => 전역으로 관리
    //         //-- 미확인 알람 전체 리스트
    //         props.sse.addEventListener('allAlarm', (event: any) => {
    //             console.log('alarmList ::::', event);
    //             // console.log('alarmList event.data ::::', event.data);

    //             // const eventData = JSON.parse(event.data);

    //             // console.log('eventData ::::', eventData);
    //         });

    //         //-- 메세지
    //         props.sse.addEventListener('commentAlarm', (event: any) => {
    //             console.log('commentAlarm ::::', event);
    //             console.log('commentAlarm event.data ::::', event.data);

    //             const eventData = JSON.parse(event.data);

    //             console.log('eventData ::::', eventData);
    //         });
    //     }

    //     const eventSource = new EventSourcePolyfill(
    //         `${process.env.REACT_APP_DB_HOST}/subscribe/alarming`,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${uToken}`,
    //             },
    //         }
    //     );

    // //-- 연결
    // eventSource.addEventListener('connected', (e: any) => {
    //     const { data: receivedSections } = e;

    //     console.log('connected ::::', e);
    // });

    // //-- 연결 시 할 일
    // eventSource.onopen = async () => {
    //     console.log('EventSource connection opened. onopen ::::');

    //     //     // 기존 알람 데이터 받아오기
    //     //     try {
    //     //         const res = await fetch(
    //     //             `${process.env.REACT_APP_DB_HOST}/subscribe/alarm`,
    //     //             {
    //     //                 method: 'GET',
    //     //                 headers: {
    //     //                     Authorization: `Bearer ${uToken}`,
    //     //                 },
    //     //             }
    //     //         );

    //     //         const data = await res.json();
    //     //         console.log('Initial alarm data:', data);
    //     //         // 여기서 기존 알람 데이터를 처리하거나 상태 업데이트 등을 수행할 수 있습니다.
    //     //     } catch (error) {
    //     //         console.error('Error fetching initial alarm data:', error);
    //     //     }
    // };

    // 서버로부터 연결 이벤트를 수신할 때의 처리
    // eventSource.addEventListener('connection', (event: any) => {
    //     console.log('e', event);

    //     const eventData = JSON.parse(event.data);
    //     console.log('Received connect event:', eventData);
    //     // 여기서 상태를 업데이트하거나 필요한 작업을 수행할 수 있습니다.
    // });

    // 서버로부터 연결 이벤트를 수신할 때의 처리
    // eventSource.addEventListener('connection', (event: any) => {
    //     console.log('e', event);

    //     const eventData = JSON.parse(event.data);
    //     console.log('Received connect event:', eventData);
    //     // 여기서 상태를 업데이트하거나 필요한 작업을 수행할 수 있습니다.
    // });

    // eventSource.onmessage = async (e) => {
    //     console.log('onmessage ::::::', e);
    //     const res = await e.data;
    //     const parsedData = JSON.parse(res);
    //     //-- 받아오는 data로 할 일
    //     console.log(parsedData);
    // };

    // // 서버로부터 이벤트를 수신할 때의 처리
    // props.sse.onmessage = (event: any) => {
    //     console.log('e', event);

    //     const eventData = JSON.parse(event.data);
    //     console.log('Received event data:', eventData);
    //     // 여기서 상태를 업데이트하거나 필요한 작업을 수행할 수 있습니다.
    // };

    //     if (props.sse) {
    //         props.sse.onerror = (e: any) => {
    //             console.log('e', e);

    //             //-- 종료 또는 에러 발생 시 할 일
    //             // eventSource.close();

    //             if (e.error) {
    //                 //-- 에러 발생 시 할 일
    //                 console.error('EventSource error:', e.error);
    //             }

    //             if (e.target.readyState === EventSource.CLOSED) {
    //                 //-- 종료 시 할 일
    //                 console.log('EventSource connection closed.');
    //             }
    //         };
    //     } else {
    //         console.error('props.sse is undefined');
    //     }
    // };

    //-- 컴포넌트가 마운트될 때 EventSource 생성
    useEffect(() => {
        if (isAlarm) {
            // getNoti();
        }
    }, [isAlarm]);

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

    return (
        <>
            <div className="header-blur">
                <div className="header-container">
                    {/* 로고 */}
                    <div
                        className="header-divOne"
                        style={{ zIndex: '0', height: '120px' }}
                    >
                        <Link to="/">
                            <div className="title1 logo-text">MOTI</div>
                        </Link>
                    </div>

                    {/* 회원가입 페이지 */}
                    {props.isJoinPage ? (
                        ''
                    ) : (
                        <div className="header-divTwo pcMode">
                            <nav className="header-nav ">
                                {/* <ThemeProvider theme={theme}> */}
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
                                                            <Button className="menu-button">
                                                                Management
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ) : (
                                            <div className="menu-list-btn">
                                                <li onClick={mainActiveHandler}>
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
                                                    onClick={groupActiveHandler}
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

                                                {props.adminUser ? (
                                                    // === admin 경우 ===
                                                    <li
                                                        onClick={
                                                            adminActiveHandler
                                                        }
                                                    >
                                                        <Link to="/management">
                                                            <Button className="menu-button">
                                                                Management
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    ''
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
                                        props.adminUser ? (
                                            // === admin 경우 ===
                                            <li>
                                                <ThemeProvider theme={theme}>
                                                    {/* <Link to="/login">Login</Link> */}

                                                    <Link to="/login">
                                                        <Button
                                                            aria-label="outlined button group"
                                                            variant="outlined"
                                                            className="menu-button"
                                                            onClick={
                                                                logoutHandler
                                                            }
                                                        >
                                                            Logout
                                                        </Button>
                                                    </Link>
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
                                                    <span id="chat-text">
                                                        Chat
                                                    </span>
                                                </div>
                                            )}

                                            <div className="logout-icon-container">
                                                <img
                                                    src="/asset/icons/Bell.svg"
                                                    alt="alarm"
                                                    onClick={alarmHandler}
                                                    id="logout-btn"
                                                />
                                                <div
                                                    className="noti-count-wrapper"
                                                    onClick={alarmHandler}
                                                >
                                                    <span className="notification-count">
                                                        {props.alarmCount < 100
                                                            ? props.alarmCount
                                                            : '99+'}
                                                    </span>
                                                </div>
                                                {/* <span id="logout-text">Bell</span> */}
                                            </div>
                                            {/* 알람창 컴포넌트 */}

                                            {isAlarm && (
                                                <Alarm
                                                    alarmHandler={alarmHandler}
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

                {/* 모바일일 때 메뉴 바*/}
                <div className="header-divTwo mobMode">
                    <nav className="header-nav ">
                        <ul
                            className="menu"
                            style={{
                                display: isVisibleMobile ? 'flex' : 'none',
                            }}
                        >
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

                            {/* 관리자만 보이는 버튼 */}
                            {/* <li>
                            <Link to="/management/users">
                                <button className="menu-button">
                                    Management
                                </button>
                            </Link>
                        </li> */}

                            {/* 로그인/비로그인 구분 */}
                            {!isCookie ? (
                                <li>
                                    {/* 비로그인 시 */}
                                    <Link to="/login">
                                        <button className="menu-button">
                                            Login
                                        </button>
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
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
                                        <img
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
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
