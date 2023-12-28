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
    recentMsg,
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

    console.log('방 퇴장 시 recentMsg', recentMsg);

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

                {!madeGroupInfo && !madeJoinInfo ? (
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            color: 'gray',
                            paddingTop: '2rem',
                        }}
                    >
                        현재 참여한 채팅방이 없어요 !
                    </div>
                ) : (
                    madeGroupInfo?.map((group: any, idx: number) => {
                        return (
                            <li
                                className="group-list"
                                onClick={() =>
                                    enterChatRoom(group.gSeq, group.gName)
                                }
                            >
                                <div className="list-content-wrapper">
                                    <img
                                        src="/asset/images/leader.gif"
                                        alt=""
                                    />

                                    <div>
                                        <div className="group-name">
                                            {group.gName}
                                        </div>

                                        {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                                            msg.msg 띄워주기  */}
                                        {recentMsg
                                            ?.filter(
                                                (recent: any) =>
                                                    recent.gSeq === group.gSeq
                                            )
                                            .map((filteredRecent: any) => (
                                                <span className="preview">
                                                    {filteredRecent.msg.msg}
                                                </span>
                                            ))}
                                    </div>

                                    <div
                                        className="chat-list-count-wrapper"
                                        // onClick={alarmHandler}
                                    >
                                        <p>1 : 02 PM</p>
                                        <span className="chat-list-count">
                                            {/* 미확인 메세지 개수 */}
                                            {localStorage.getItem(
                                                `gSeq${group.gSeq}`
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })
                )}
                {madeJoinInfo?.map((group: any, idx: number) => {
                    return (
                        <li
                            className="group-list"
                            onClick={() =>
                                enterChatRoom(group.gSeq, group.gName)
                            }
                        >
                            <div className="list-content-wrapper">
                                <img src="/asset/images/member.gif" alt="" />

                                <div>
                                    <div className="group-name">
                                        {group.gName}
                                    </div>

                                    {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                                            msg.msg 띄워주기  */}
                                    {recentMsg
                                        ?.filter(
                                            (recent: any) =>
                                                recent.gSeq === group.gSeq
                                        )
                                        .map((filteredRecent: any) => (
                                            <span className="preview">
                                                {filteredRecent.msg.msg}
                                            </span>
                                        ))}
                                </div>

                                <div
                                    className="chat-list-count-wrapper"
                                    // onClick={alarmHandler}
                                >
                                    {/* [추후] 시간변경 */}
                                    <p>12 : 02 PM</p>
                                    <span className="chat-list-count">
                                        {/* 미확인 메세지 개수 */}
                                        {localStorage.getItem(
                                            `gSeq${group.gSeq}`
                                        )}
                                    </span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
