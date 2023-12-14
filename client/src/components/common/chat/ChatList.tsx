import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

// import { socket } from '../SidebarChat';

export default function ChatList({
    isEnter,
    setIsEnter,
    setNowGSeq,
    setNowGName,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    // ] 유저 가입 모임
    const getJoinedGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/joined`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { groupInfo } = res.data;

                setJoinGroupInfo(groupInfo);
            });
    };

    useEffect(() => {
        getJoinedGroup();
    }, []);

    const [madeJoinInfo, setJoinGroupInfo] = useState<any>([]);

    //] 유저 생성 모임
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
        getMadeGroup();
    }, []);

    const [madeGroupInfo, setMadeGroupInfo] = useState<any>([]);

    // console.log(madeGroupInfo);
    // console.log(madeJoinInfo);

    const enterChatRoom = (gSeq: number, gName: string) => {
        setNowGSeq(gSeq);
        setNowGName(gName);
        setIsEnter(true);
        console.log('isEnter', isEnter);
    };

    return (
        <ul>
            채팅방을 클릭해주세요
            {madeGroupInfo?.map((group: any, idx: number) => {
                return (
                    <li
                        className="group-list"
                        onClick={() => enterChatRoom(group.gSeq, group.gName)}
                    >
                        <div>내가 모임장 !</div>
                        <div>👑</div>
                        <div className="group-name">
                            {group.gSeq}번의 {group.gName}모임
                        </div>
                        <div>메세지 2개 도착</div>
                    </li>
                );
            })}
            {madeJoinInfo?.map((group: any, idx: number) => {
                return (
                    <li
                        className="group-list"
                        onClick={() => enterChatRoom(group.gSeq, group.gName)}
                    >
                        <div className="group-name">
                            {group.gSeq}번의 {group.gName}모임
                        </div>
                        <div>메세지 4개 도착</div>
                    </li>
                );
            })}
        </ul>
    );
}
