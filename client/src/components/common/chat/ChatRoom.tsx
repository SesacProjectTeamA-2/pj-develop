import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
// import useSocket from 'src/hooks/useSocket';

import '../../../styles/scss/components/chatroom.scss';

export default function ChatRoom({
    isEnter,
    setIsEnter,
    // setSendMsg,
    // sendMsg,
    nowGSeq,
    nowGName,
    socket,
    uName,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    // console.log('socket:::::', socket);

    // 받아올 채팅 1️
    const [allMsg, setAllMsg] = useState<any>([]);

    const [loginUser, setLoginUser] = useState<any>([]);

    const [loginUName, setLoginUName] = useState<any>([]);

    // 내가 서버에 전송할 데이터 2
    const [msgData, setMsgData] = useState<any>({
        uSeq: 0,
        timeStamp: '',
        msg: '',
        gSeq: nowGSeq,
        socketId: socket?.id,
        uName: uName,
    });

    // 내가 전송한 채팅 3 (화면에 보여주기용)
    const [sendMsg, setSendMsg] = useState<any>({
        timeStamp: '', // 화면에 변환되어 보여줌
        msg: '',
        uName: uName,
        socketId: socket?.id,
    });

    // 서버에서 받아올 데이터
    const [msgList, setMsgList] = useState<any>();

    // 입력창 값
    const [inputValue, setInputValue] = useState('');

    // 전송 버튼 클릭
    const [isSent, setIsSent] = useState(false);

    // 현재 시간
    const [currentTime, setCurrentTime] = useState(new Date());

    // 특정 그룹 정보 가져오기
    const [groupDetail, setGroupDetail] = useState<any>({
        grInformation: '',
        groupCategory: '',
        groupCoverImg: '',
        groupDday: 0,
        groupMaxMember: 0,
        groupMember: [],
        groupMission: [],
        groupName: '',
        isJoin: false,
        isLeader: false,
        nowScoreUserInfo: [],
        totalScoreUserInfo: [],
        result: false,
        leaderInfo: {
            uSeq: 0,
            uName: '',
            uImg: '',
            uCharImg: '',
        },
        memberArray: [],
    });

    // 모임장 / 멤버
    const [isLeader, setIsLeader] = useState(false);

    //] 입장한 그룹 정보 가져오기
    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${nowGSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setGroupDetail(res.data);

                setIsLeader(res.data.isLeader);

                // setMemberList(res.data.memberArray)
            });
    };

    // ] uSeq 데이터 전송
    const getJoinedGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/joined`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { uSeq } = res.data;

                setMsgData((prevData: any) => ({
                    ...prevData,
                    uSeq,
                }));
            });
    };

    useEffect(() => {
        getGroup(); // 입장한 특정 그룹 정보
        getJoinedGroup(); // uSeq
    }, []);

    //] 채팅방 입장
    useEffect(() => {
        // console.log('joinRoom nowGSeq :::::', nowGSeq);

        socket?.emit('joinRoom', { gSeq: nowGSeq });

        // joinRoom 이벤트에 대한 리스너 추가
        socket?.on('joinRoom', (data: any) => {
            console.log('joinRoom event received on client', data); // 서버에서 보낸 data

            console.log('data.allMsg >>>>>>', data.allMsg);

            // 메세지 없을 경우 : '모임방 메세지 없음 !'
            if (typeof data.allMsg !== 'string') {
                const formattedData = data.allMsg?.map((msg: any) => ({
                    gSeq: msg.gSeq,
                    msg: msg.msg,
                    timeStamp: new Date(msg.timeStamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        // hour12: false,
                    }),
                    uSeq: msg.uSeq,
                    uName: msg.uName,
                }));

                setAllMsg(formattedData);
            }

            if (data.loginUser?.length > 0) {
                setLoginUser(data.loginUser);
            }
        });
    }, []);

    //; allMsg, data.loginUser 변경될 때마다
    useEffect(() => {
        // joinRoom 이벤트에 대한 리스너 추가
        socket?.on('joinRoom', (data: any) => {
            console.log('joinRoom event received on client', data); // 서버에서 보낸 data

            console.log('data.allMsg >>>>>>', data.allMsg);

            if (typeof data.allMsg !== 'string') {
                const formattedData = data.allMsg?.map((msg: any) => ({
                    gSeq: msg.gSeq,
                    msg: msg.msg,
                    timeStamp: new Date(msg.timeStamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        // hour12: false,
                    }),
                    uSeq: msg.uSeq,
                    uName: msg.uName,
                }));

                setAllMsg(formattedData);
            }

            if (data.loginUser.length > 0) {
                // setLoginUser(data.loginUser);

                let updatedLoginUName = [];
                for (let i = 0; i < data.loginUser.length; i++) {
                    updatedLoginUName.push(data.loginUser[i]?.uName);
                }
                setLoginUName(updatedLoginUName);
            }
        });

        console.log('allMsg >>>>>>', allMsg);

        console.log('loginUser >>>>>>', loginUser);
        console.log('loginUName >>>>>>', loginUName);
    }, [loginUser, allMsg]);

    //] 메세지 입력
    const handleChangeMsg = (msg: string) => {
        setIsSent(false);
        setInputValue(msg);

        // 서버에 전송할 데이터
        setMsgData((prevData: any) => ({
            ...prevData,
            msg,
        }));

        // 화면에 보여줄 데이터
        setSendMsg((prevData: any) => ({
            ...prevData,
            msg,
        }));
    };

    //] 상대방이 문자 전송할 경우 (실시간 업데이트)
    // useEffect(() => {
    //     //-- 서버에서 데이터 받아오기
    //     socket?.on('msg', (data: any) => {
    //         console.log('MSG event received on client', data); // 서버에서 보낸 data

    //         // setSendMsg((prevData: any) => ({
    //         //     ...prevData,
    //         //     timeStamp: data.timeStamp,
    //         //     msg: data.msg,
    //         // }));
    //     });

    //     //-- 말풍선 추가
    //     // console.log('#######', sendMsg);
    //     addMessageBubble(sendMsg);
    // }, []);

    //] 말풍선을 화면에 추가하는 함수 (내가 전송)
    const addMessageBubble = (data: any) => {
        const chatContainer = document.getElementById('chat');
        if (chatContainer) {
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'chat-bubble-send';

            const timeDiv = document.createElement('div');
            timeDiv.className = 'send-time';

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message send-msg';

            const timeText = document.createTextNode(data.timeStamp?.time);
            const messageText = document.createTextNode(data.msg);
            // `${data.uName}: ${data.msg}`

            messageDiv.appendChild(messageText);
            timeDiv.appendChild(timeText);
            bubbleDiv.appendChild(timeDiv);
            bubbleDiv.appendChild(messageDiv);
            chatContainer.appendChild(bubbleDiv);
        }
    };

    //] 말풍선을 화면에 추가하는 함수 (타인이 보낸 메세지)
    const addReceivedMessageBubble = (data: any) => {
        // 시간 변환
        const date = new Date(data.timeStamp);

        // 수정된 부분: 시간을 24시간 형식으로 변환
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        const chatContainer = document.getElementById('chat');
        if (chatContainer) {
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'chat-bubble-receive';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'send-user';

            const timeDiv = document.createElement('div');
            timeDiv.className = 'receive-time';

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message re-msg';

            const timeText = document.createTextNode(formattedTime);
            const messageText = document.createTextNode(data.msg);
            const nameText = document.createTextNode(data.uName);

            nameDiv.appendChild(nameText);
            messageDiv.appendChild(messageText);
            timeDiv.appendChild(timeText);
            bubbleDiv.appendChild(nameDiv);
            bubbleDiv.appendChild(messageDiv);
            bubbleDiv.appendChild(timeDiv);
            chatContainer.appendChild(bubbleDiv);
        }
    };

    //] 메세지 전송
    const sendMessage = () => {
        const timeStamp = Date.now();
        const currentDate = new Date(timeStamp);

        // 전송할 데이터
        setMsgData((prevData: any) => ({
            ...prevData,
            timeStamp: currentDate, // Mon Dec 18 2023 08:12:07 GMT+0900 (한국 표준시)
        }));

        // 화면에 보여줄 데이터
        setSendMsg((prevData: any) => ({
            ...prevData,
            // timeStamp: currentDate.toLocaleString(), // 2023. 12. 18. 오전 8:12:55
            timeStamp: {
                date: currentDate.toLocaleDateString(), // 2023. 12. 18.
                time: currentDate.toLocaleTimeString([], {
                    // 오전 8:12
                    hour: '2-digit',
                    minute: '2-digit',
                    // hour12: false,
                }),
            },
        }));

        setIsSent(true);
        setInputValue('');
    };

    //; 메세지 전송
    // 1. 문자 입력
    // 2. 전송을 누른다
    // 3. 서버에 데이터를 전송한다
    // 4. 서버에 데이터를 가공해서 말풍선을 그려준다
    useEffect(() => {
        if (isSent) {
            console.log('Sent !!!!!!', isSent);
            console.log('sendMsg !!!!!!', sendMsg);
            console.log('msgData !!!!!!', msgData);

            // 서버에 데이터 전송
            socket?.emit('sendMsg', msgData);

            // // 서버에서 데이터 받아오기
            // socket?.on('msg', (data: any) => {
            //     console.log('MSG - msgList ::::: ', data); // 서버에서 보낸 data

            //     setMsgList(data);

            //     // setMsgList((prevData: any) => ({
            //     //     ...prevData,
            //     //     timeStamp: data.timeStamp,
            //     //     msg: data.msg,
            //     // }));

            //--  받아오는 말풍선 추가
            //     // addReceivedMessageBubble(data);
            // });

            //-- 말풍선 추가
            addMessageBubble(sendMsg);
        }
    }, [isSent]);

    console.log('msgList', msgList);

    useEffect(() => {
        // 서버에서 데이터 받아오기
        socket?.on('msg', (data: any) => {
            console.log('MSG event received on client', data); // 서버에서 보낸 data

            setMsgList(data);

            // setMsgList((prevData: any) => ({
            //     ...prevData,
            //     timeStamp: data.timeStamp,
            //     msg: data.msg,
            // }));

            //-- 받아오는 말풍선 추가
            addReceivedMessageBubble(data);
        });
    }, [socket, msgList]);

    // joinRoom - allMsg (방에 입장하기 전, 주고 받은 문자 내역들)
    // +++
    // msg - msgList (방에 입장 이후, 받은 문자)

    //-- key down event 입력 시
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) {
            return;
        }

        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    //] 방 나가기
    const leaveHandler = () => {
        //~ roomInfo 추가
        // useEffect(() => {
        //     if (showChat) {
        //         socket?.emit('roomInfo');

        //         // 서버에서 보낸 data
        //         socket?.on('roomInfo', (data: any) => {
        //             console.log('roomInfo event received on client :::', data);
        //         }); // 최신 메세지, 안읽은 메세지 없으면 : [] 빈 배열
        //     }
        // }, [showChat]);

        setIsSent(false);
        setIsEnter(false);
    };

    //-- 채팅 받아오기
    // useEffect(() => {
    //     // 방 고유 Id
    //     // socket 연결
    //     // if (!socketInstances[id]) {
    //     //   socketInstances[id] = socket(`${id}`)
    //     // 서버에서 넘어오는 chat 응답 받아오기
    //     //   socketInstances[id].on('chat', (data: socketChatMsg) => {
    //     //     const newChat: ChatMsg = {
    //     //       username: data.userInfo.userId,
    //     //       message: data.message.message,
    //     //       admin: data.userInfo.isAdmin,
    //     //     };
    //     //     setChat((prevChat) => [...prevChat, newChat]);
    //     //   });
    // }, []);

    // useEffect(() => {
    //     socket.on('receive_message', (data) => {
    //         setChat(data.message);
    //     });
    // }, [socket]);

    console.log(msgData);
    console.log('::::::', allMsg);

    console.log('외부 loginUName ::::: ', loginUName);

    return (
        <main className="chat-box">
            {/* <button id="send-btn" type="button" onClick={leaveHandler}>
                나가기
            </button> */}

            {/* === 채팅 스타일링 === */}

            {/* MEMBER LIST */}
            <div className="empty-contacts-wrapper">
                <div className="contacts">
                    <div className="list-title-wrapper">
                        <svg
                            viewBox="0 0 512 512"
                            fill="currentColor"
                            height="2em"
                            width="2em"
                            className="member-icon"
                        >
                            <path d="M336 256c-20.56 0-40.44-9.18-56-25.84-15.13-16.25-24.37-37.92-26-61-1.74-24.62 5.77-47.26 21.14-63.76S312 80 336 80c23.83 0 45.38 9.06 60.7 25.52 15.47 16.62 23 39.22 21.26 63.63-1.67 23.11-10.9 44.77-26 61C376.44 246.82 356.57 256 336 256zm66-88zM467.83 432H204.18a27.71 27.71 0 01-22-10.67 30.22 30.22 0 01-5.26-25.79c8.42-33.81 29.28-61.85 60.32-81.08C264.79 297.4 299.86 288 336 288c36.85 0 71 9 98.71 26.05 31.11 19.13 52 47.33 60.38 81.55a30.27 30.27 0 01-5.32 25.78A27.68 27.68 0 01467.83 432zM147 260c-35.19 0-66.13-32.72-69-72.93-1.42-20.6 5-39.65 18-53.62 12.86-13.83 31-21.45 51-21.45s38 7.66 50.93 21.57c13.1 14.08 19.5 33.09 18 53.52-2.87 40.2-33.8 72.91-68.93 72.91zM212.66 291.45c-17.59-8.6-40.42-12.9-65.65-12.9-29.46 0-58.07 7.68-80.57 21.62-25.51 15.83-42.67 38.88-49.6 66.71a27.39 27.39 0 004.79 23.36A25.32 25.32 0 0041.72 400h111a8 8 0 007.87-6.57c.11-.63.25-1.26.41-1.88 8.48-34.06 28.35-62.84 57.71-83.82a8 8 0 00-.63-13.39c-1.57-.92-3.37-1.89-5.42-2.89z" />
                        </svg>

                        <h2>Member</h2>
                    </div>

                    <div className="contact">
                        {/* --- LEADER --- */}
                        <div className="pic rogers">
                            <img
                                src={
                                    groupDetail.leaderInfo.uImg ||
                                    '/asset/images/user.svg'
                                }
                                alt="userImg"
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontWeight: 'bold',
                                    paddingLeft: '0.5rem',
                                }}
                            >
                                LEADER
                            </div>
                            <div className="name">
                                {groupDetail.leaderInfo.uName}
                            </div>
                        </div>

                        {/* 소켓 통신 유무를 통한 온/오프라인 구분 */}
                        {isLeader ? (
                            <div className="badge"></div>
                        ) : loginUName.includes(
                              groupDetail.leaderInfo.uName
                          ) ? (
                            <div className="badge"></div>
                        ) : (
                            <div className="badge-off"></div>
                        )}
                    </div>

                    {/* --- MEMBER --- */}
                    {groupDetail.memberArray?.map((member: any) => {
                        return (
                            <div className="contact">
                                <div className="pic rogers">
                                    <img
                                        src={
                                            member.uImg ||
                                            '/asset/images/user.svg'
                                        }
                                        alt="userImg"
                                    />
                                </div>
                                <div className="name"> {member.uName}</div>

                                {/* 소켓 통신 유무를 통한 온/오프라인 구분 */}
                                {loginUName.includes(member.uName) ? (
                                    <div className="badge"></div>
                                ) : (
                                    <div className="badge-off"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="chat">
                <div className="contact chat-list-box bar">
                    {/* <svg
                        viewBox="0 0 512 512"
                        fill="currentColor"
                        height="1.5em"
                        width="1.5em"
                        className="leave-icon"
                        onClick={leaveHandler}
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={48}
                            d="M244 400L100 256l144-144M120 256h292"
                        />
                    </svg> */}

                    <svg
                        viewBox="0 0 512 512"
                        fill="currentColor"
                        height="1.5em"
                        width="1.5em"
                        className="leave-icon"
                        onClick={leaveHandler}
                    >
                        <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
                    </svg>

                    {/* <div className="pic title7">{nowGSeq}번</div> */}
                    <div className="group-name">{nowGName}</div>
                    {/* <div className="pic stark" /> */}
                    {/* <div className="name">Tony Stark</div> */}
                    {/* <div className="seen">Today at 12:56</div> */}
                </div>

                {/*========= 채팅 ========== */}
                <div id="chat" className="messages">
                    <div className="time">
                        {/* --- 날짜 --- */}
                        {currentTime.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })}
                        {/* --- 시간 --- */}
                        {/*  Today at {currentTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })} */}
                    </div>

                    {/* ### 예시 보내는 문자 ### */}
                    {/* <div className="chat-bubble-send">
                      
                        <div className="msg-container">
                            <div className="send-time">오전 09:05</div>
                            <div className="message send-msg">
                                Hey, man! What's up, Mr Stark? 👋
                            </div>
                        </div>
                    </div> */}

                    {/* ----- 문자 내역 ----- */}
                    {allMsg
                        ?.slice()
                        .reverse()
                        .map((chat: any) => {
                            return (
                                <>
                                    {chat.uName === uName ? (
                                        //  ----- 보냈던 문자 -----
                                        <div className="chat-bubble-send">
                                            <div className="msg-container">
                                                <div className="send-time">
                                                    {chat.timeStamp}
                                                </div>
                                                <div className="message send-msg">
                                                    {chat.msg}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        //  ----- 받은 문자 -----
                                        <div className="chat-bubble-receive">
                                            <div className="send-user">
                                                {chat.uName}
                                            </div>
                                            <div className="msg-container">
                                                <div className="message re-msg">
                                                    {chat.msg}
                                                </div>
                                                <div className="receive-time">
                                                    {chat.timeStamp}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })}

                    {/* ----- 방 입장 후, 실시간으로 받은 문자 ----- */}
                    {/* {msgList?.map((chat: any) => {
                        <>
                            // ----- 실시간으로 받은 문자 -----
                            <div className="chat-bubble-receive">
                                <div className="send-user">{chat.uName}</div>
                                <div className="msg-container">
                                    <div className="message re-msg">
                                        {chat.msg}
                                    </div>
                                    <div className="receive-time">
                                        {chat.timeStamp}
                                    </div>
                                </div>
                            </div>
                        </>;
                    })} */}

                    {/* ----- 방 입장 후, 주고 받은 문자 ----- */}
                    {/* {msgList?.map((chat: any) => {
                        <>
                            {chat.uName === uName ? (
                                //  ----- 내가 전송 클릭한 문자 -----
                                <div className="chat-bubble-send">
                                    <div className="msg-container">
                                        <div className="send-time">
                                            {chat.timeStamp}
                                        </div>
                                        <div className="message send-msg">
                                            {chat.msg}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                //  ----- 실시간으로 받은 문자 -----
                                <div className="chat-bubble-receive">
                                    <div className="send-user">
                                        {chat.uName}
                                    </div>
                                    <div className="msg-container">
                                        <div className="message re-msg">
                                            {chat.msg}
                                        </div>
                                        <div className="receive-time">
                                            {chat.timeStamp}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>;
                    })} */}

                    {/* <div className="message send-msg">Field trip! 🤣</div> */}
                    {/* <div className="message send-msg">
                        Uh, what is this guy's problem, Mr. Stark? 🤔
                    </div>
                    <div className="message re-msg">
                        Uh, he's from space, he came here to steal a necklace
                        from a wizard.
                    </div> */}

                    {/* --- 타이핑 중입니다.... --- */}
                    {/* <div className="message re-msg">
                        <div className="typing typing-1" />
                        <div className="typing typing-2" />
                        <div className="typing typing-3" />
                    </div> */}
                </div>

                <div className="input">
                    {/* <i className="fas fa-camera" /> */}
                    {/* <i className="far fa-laugh-beam" /> */}

                    {/* === 메세지 입력창 === */}
                    <input
                        type="text"
                        value={inputValue}
                        placeholder="Type your message here!"
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleChangeMsg(e.target.value)}
                    />
                    <img
                        src="/asset/icons/chat.svg"
                        alt="chatImg"
                        className="send-icon"
                        onClick={sendMessage}
                    />
                </div>
            </div>

            {/* 채팅방 리스트 */}
            {/* <div className="chat-list"></div> */}
            {/* <select id="group-list"></select> 모임 */}
            {/* <div className="input-container">
                <input
                    type="text"
                    id="message"
                    // onKeyPress="if(window.event.keyCode==13){send()}"
                    onChange={(e) => handleChangeMsg(e.target.value)}
                />
                <button id="send-btn" type="button" onClick={send}>
                    전송
                </button>
                <p>Message from server: {sendMsg}</p>
                <button onClick={sendMessage}>Send Message to Server</button>
            </div> */}
        </main>
    );
}
