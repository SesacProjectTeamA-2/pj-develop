import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import '../../../styles/scss/components/chatlist.scss';

export default function ChatList({
    isEnter,
    setIsEnter,
    setNowGSeq,
    setNowGName,
    showChatting,
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

    const enterChatRoom = (gSeq: number, gName: string) => {
        setNowGSeq(gSeq);
        setNowGName(gName);
        setIsEnter(true);
    };

    return (
        <div className="chat-list-wrapper">
            <div className="chat-list-close-icon-wrapper">
                <svg
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    height="1.5em"
                    width="1.5em"
                    className="chat-list-close-icon"
                    onClick={() => showChatting()}
                >
                    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
                </svg>
            </div>
            <ul>
                {/* 채팅방을 클릭해주세요 */}

                {madeGroupInfo?.map((group: any, idx: number) => {
                    return (
                        <li
                            className="group-list"
                            onClick={() =>
                                enterChatRoom(group.gSeq, group.gName)
                            }
                        >
                            <div className="list-content-wrapper">
                                <img
                                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/thomas.jpg"
                                    alt=""
                                />
                                <div>
                                    <div>👑</div>
                                    <div className="group-name">
                                        {group.gName}
                                    </div>
                                    <span className="preview">
                                        I was wondering...
                                    </span>
                                </div>

                                <div
                                    className="chat-list-count-wrapper"
                                    // onClick={alarmHandler}
                                >
                                    {/* <p>1 : 02 PM</p> */}
                                    <span className="chat-list-count">6</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
                {madeJoinInfo?.map((group: any, idx: number) => {
                    return (
                        <li
                            className="group-list"
                            onClick={() =>
                                enterChatRoom(group.gSeq, group.gName)
                            }
                        >
                            <div className="list-content-wrapper">
                                <img
                                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/dog.png"
                                    alt=""
                                />
                                <div className="group-name">{group.gName}</div>

                                <div
                                    className="chat-list-count-wrapper"
                                    // onClick={alarmHandler}
                                >
                                    <p>12 : 02 PM</p>
                                    <span className="chat-list-count">6</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
