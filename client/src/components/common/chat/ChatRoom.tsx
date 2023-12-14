import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';

// import { socket } from '../SidebarChat';

import '../../../styles/scss/components/chatroom.scss';

export default function ChatRoom({
    isEnter,
    setIsEnter,
    setSendMsg,
    sendMsg,
    nowGSeq,
    nowGName,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const socket = io(`${process.env.REACT_APP_DB_HOST}/socket/chat`);

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

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${nowGSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);

                setGroupDetail(res.data);

                setIsLeader(res.data.isLeader);

                // setMemberList(res.data.memberArray)
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    // useEffect(() => {
    //     // 컴포넌트가 마운트되었을 때 실행되는 코드
    //     socket.on('message', (data: string) => {
    //         setSendMsg(data);
    //     });
    // }, []);

    const leaveHandler = () => {
        setIsEnter(false);
    };

    const handleChangeMsg = (message: string) => {
        setSendMsg(message);
    };

    const sendMessage = () => {
        socket.emit('sendMessage', 'Hello, Server!');
    };

    const send = () => {
        console.log('전송');
    };

    //-- 입장 알림
    useEffect(() => {
        // 이때 id는 각 경매방이 가진 고유 Id
        // socket 연결
        // if (!socketInstances[id]) {
        //   socketInstances[id] = socket(`${id}`)
        //   // 서버에서 넘어오는 alert 응답 받아오기
        //   socketInstances[id].on('alert', (message: string) => {
        //     const welcomeChat: ChatMsg = {
        //       username: '알림',
        //       message: message,
        //     };
        //     setChat((prevChat) => [...prevChat, welcomeChat]);
        //  }
    }, []);

    //-- 입력한 채팅을 서버 측으로 보내는 소켓 이벤트 함수
    // const handleSendMsg = () => {
    //     socketInstances[id].emit('chat', {
    //         message: sendMsg,
    //     });
    //     setSendMsg('');
    // };

    //-- 채팅 받아오기
    useEffect(() => {
        // 방 고유 Id
        // socket 연결
        // if (!socketInstances[id]) {
        //   socketInstances[id] = socket(`${id}`)
        // 서버에서 넘어오는 chat 응답 받아오기
        //   socketInstances[id].on('chat', (data: socketChatMsg) => {
        //     const newChat: ChatMsg = {
        //       username: data.userInfo.userId,
        //       message: data.message.message,
        //       admin: data.userInfo.isAdmin,
        //     };
        //     setChat((prevChat) => [...prevChat, newChat]);
        //   });
    }, []);

    // useEffect(() => {
    //     socket.on('receive_message', (data) => {
    //         setChat(data.message);
    //     });
    // }, [socket]);

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

                        {/* [추후] 소켓 통신 유무를 통한 온라인 구분 */}
                        {/* 온라인 / 오프라인 */}
                        <div className="badge"></div>
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

                                {/* [추후] 소켓 통신 유무를 통한 온라인 구분 */}
                                {/* 온라인 / 오프라인 */}
                                <div className="badge"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="chat">
                <div className="contact chat-list-box bar">
                    <svg
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
                    </svg>

                    {/* <div className="pic title7">{nowGSeq}번</div> */}
                    <div className="group-name">{nowGName}</div>
                    {/* <div className="pic stark" /> */}
                    {/* <div className="name">Tony Stark</div> */}
                    {/* <div className="seen">Today at 12:56</div> */}
                </div>

                <div id="chat" className="messages">
                    <div className="time">Today at 11:41</div>
                    <div className="message parker">
                        Hey, man! What's up, Mr Stark? 👋
                    </div>
                    <div className="message stark">
                        Kid, where'd you come from?
                    </div>
                    <div className="message parker">Field trip! 🤣</div>
                    <div className="message parker">
                        Uh, what is this guy's problem, Mr. Stark? 🤔
                    </div>
                    <div className="message stark">
                        Uh, he's from space, he came here to steal a necklace
                        from a wizard.
                    </div>
                    <div className="message stark">
                        <div className="typing typing-1" />
                        <div className="typing typing-2" />
                        <div className="typing typing-3" />
                    </div>
                </div>

                <div className="input">
                    {/* <i className="fas fa-camera" /> */}
                    {/* <i className="far fa-laugh-beam" /> */}

                    {/* 메세지 입력창 */}
                    <input
                        type="text"
                        placeholder="Type your message here!"
                        onChange={(e) => handleChangeMsg(e.target.value)}
                    />
                    <img
                        src="/asset/icons/chat.svg"
                        alt="chatImg"
                        className="send-icon"
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
