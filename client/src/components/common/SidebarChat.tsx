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
import useSocket from 'src/hooks/useSocket';

//-- 토큰 인증하여 서버 연결
// API 뒤에 오는 Id 값으로 namespace 구분이 된다. ▶️ io('API주소/Id값')

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

    const socket = useSocket();

    // 1. 사용자 데이터 가져오기
    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { nickname } = res.data;
                setUName(nickname);
            });
    };

    useEffect(() => {
        getUserData();
    }, []);

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
                    socket={socket} // socket
                />
            )}
        </div>
    );
}
