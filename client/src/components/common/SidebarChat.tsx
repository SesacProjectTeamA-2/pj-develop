import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
// import { io } from 'socket.io-client';
import axios from 'axios';

// import { createContext } from 'react';

// import { useDispatch } from 'react-redux';
// import { socketStorage } from '../redux/action';

import '../../styles/scss/layout/sidebarChat.scss';
import ChatRoom from './chat/ChatRoom';
import ChatList from './chat/ChatList';

// export const socket = socketIo(String(process.env.REACT_APP_BACK_URL), {
//     withCredentials: true,
// });
// export const SocketContext = createContext(socket);

//-- 토큰 인증하여 서버 연결
// API 뒤에 오는 Id 값으로 namespace 구분이 된다. ▶️ io('API주소/Id값')

// const socket = io('http://localhost:8888/api/socket/chat');
// `${process.env.REACT_APP_DB_HOST}/socket/chat`,

// export const socket = io(`${process.env.REACT_APP_DB_HOST}/socket/chat`, {
// export const socket = io('http://localhost:8888/api/socket/chat');

// io(`${process.env.REACT_APP_DB_HOST}/socket/chat`, {
//     headers: {
//         Authorization: `Bearer ${uToken}`,
//     },
// });

let socketInstance: any = null;

export default function SidebarChat({ setShowChat, showChat }: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [uName, setUName] = useState(''); // 닉네임
    const [nowGSeq, setNowGSeq] = useState(1); // 모임 번호
    const [nowGName, setNowGName] = useState(''); // 모임 번호
    const [isEnter, setIsEnter] = useState(false); // 입장/나가기

    const [chat, setChat] = useState<any>([]); // 받아올 채팅 1️⃣
    const [sendMsg, setSendMsg] = useState(''); // 입력한 채팅 2️⃣

    // const [message, setMessage] = useState<string>('');

    // 1. 사용자 데이터 가져오기
    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                // console.log('user', res.data);
                const { nickname } = res.data;
                setUName(nickname);
            });
    };

    useEffect(() => {
        getUserData();
    }, []);

    // const socket = io(`${process.env.REACT_APP_DB_HOST}/socket/chat`);
    // const socket = io('http://localhost:8888/api/socket/chat');

    // const getChat = async () => {
    //     const res = await axios
    //         .get(`${process.env.REACT_APP_DB_HOST}/socket/chat`, {
    //             headers: {
    //                 Authorization: `Bearer ${uToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             console.log(res.data);

    //             socket.on('connection', (data) => {
    //                 console.log('socket server connected.');
    //                 console.log(data);
    //             });

    //             // 닉네임 서버에 전송
    //             socket.emit('setName', uName);
    //         });
    // };

    // useEffect(() => {
    //     getChat();
    // }, []);

    // useEffect(() => {
    //     // const socket = io(`${process.env.REACT_APP_DB_HOST}/socket/chat`);

    //     socket.on('connect', () => {
    //         console.log('클라이언트 연결 완료 ::', socket.id);
    //     });

    //     socket.on('send', (data) => {
    //         console.log('socket server connected.');
    //         console.log('socket server connected.', data);
    //     });
    // }, []);

    // socket.on('message', function (message: string) {
    //     console.log(message);
    // });

    // useEffect(() => {
    // const onSocket = () => {
    //     // setInterval(() => {
    //     // socket.emit('good', '클라이언트 -> 서버');
    //     // }, interval);

    //     socket.on('send', (data) => console.log(data)); // 서버 -> 클라이언트

    //     socket.emit('hi', { message: 'Hello' });

    //     console.log('###########');
    // };
    // // }, []);

    return (
        <div className="chat-container">
            {!isEnter ? (
                <div>
                    <ChatList
                        isEnter={isEnter}
                        setIsEnter={setIsEnter}
                        setNowGSeq={setNowGSeq}
                        setNowGName={setNowGName}
                        setShowChat={setShowChat}
                        showChat={showChat}
                    />
                </div>
            ) : (
                <ChatRoom
                    isEnter={isEnter}
                    setIsEnter={setIsEnter}
                    sendMsg={sendMsg}
                    setSendMsg={setSendMsg}
                    nowGSeq={nowGSeq}
                    nowGName={nowGName}
                />
            )}
        </div>
    );
}
