import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import '../../styles/scss/layout/sidebarChat.scss';
import ChatRoom from './chat/ChatRoom';
import ChatList from './chat/ChatList';
// import useSocket from 'src/hooks/useSocket';

export default function SidebarChat({
    socket,
    showChatting,
    showChat,
    recentMsg,
    setRecentMsg,
    isEnter,
    setIsEnter,
    allGroupInfo,
    setAllGroupInfo,
    loginUser,
    setLoginUser,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [uName, setUName] = useState(''); // 닉네임
    const [nowGSeq, setNowGSeq] = useState(1); // 모임 번호
    const [nowGName, setNowGName] = useState(''); // 모임명
    // const [isEnter, setIsEnter] = useState(false); // 입장/나가기

    //] 1. 사용자 데이터 가져오기
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
                <ChatList
                    isEnter={isEnter}
                    setIsEnter={setIsEnter}
                    setNowGSeq={setNowGSeq}
                    setNowGName={setNowGName}
                    showChatting={showChatting}
                    showChat={showChat}
                    recentMsg={recentMsg}
                    socket={socket}
                    setRecentMsg={setRecentMsg}
                    allGroupInfo={allGroupInfo}
                    setAllGroupInfo={setAllGroupInfo}
                    loginUser={loginUser}
                    setLoginUser={setLoginUser}
                />
            ) : (
                <ChatRoom
                    isEnter={isEnter}
                    setIsEnter={setIsEnter}
                    nowGSeq={nowGSeq}
                    nowGName={nowGName}
                    uName={uName}
                    socket={socket} // socket 인스턴스
                    setRecentMsg={setRecentMsg}
                    loginUser={loginUser}
                    setLoginUser={setLoginUser}
                />
            )}
        </div>
    );
}
