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
    socket,
    setRecentMsg,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    //=== 기존 방법
    // 1. axios 요청으로 LeaderGroup, memberGroup 모임 => 2개 state
    // 2. map => LeaderGroup |||||| map => memberGroup

    //=== 다른 방법
    // 1. axios 요청으로 LeaderGroup, memberGroup 모임
    //    => LeaderGroup + memberGroup => 하나의 state로 관리....
    // 2. map => 하나의 state만
    //    --> recentMsg 기준으로 (정렬)
    //        1) 가장 최신 2) 있으면 3) else 없음

    //===> 최신순 / 리더|멤버별
    // 버튼 state로 관리

    const [allGroupInfo, setAllGroupInfo] = useState<any>(); // 리더+멤버 모든 모임 관리
    const [sorted, setSorted] = useState('recent'); // 정렬 기준

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
                setAllGroupInfo((prev: any) => [...prev, ...groupInfo]);
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

                setAllGroupInfo((prev: any) => [...prev, ...groupInfo]);
            });
    };
    console.log('allGroupInfo>>>>', allGroupInfo);

    //] 최신 메세지 가져오기
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

                setRecentMsg(formattedData);
            });
    };

    useEffect(() => {
        getMadeGroup();
        getRecentMsg();
    }, []);

    const [madeGroupInfo, setMadeGroupInfo] = useState<any>([]);

    const enterChatRoom = (gSeq: number, gName: string) => {
        setNowGSeq(gSeq);
        setNowGName(gName);
        setIsEnter(true);
    };

    useEffect(() => {
        if (!isEnter) {
            socket?.emit('roomInfo', { isOut: '' });

            console.log('###### 채팅방 !!!');

            // 서버에서 보낸 data
            socket?.on('roomInfo', (data: any) => {
                console.log('roomInfo event received on client :::', data);

                // 시간 변환
                const formattedData = data?.map((msgObj: any) => ({
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

                setRecentMsg(formattedData);

                // console.log('formattedData', formattedData);
            }); // 최신 메세지, 안읽은 메세지 없으면 : [] 빈 배열
        }
    }, []);

    console.log('ChatList에서 recentMsg', recentMsg);

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
                    //=== 리더 & 멤버
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

                                    <div
                                        style={{
                                            display: 'flex',
                                            // width: '100%',
                                            width: '6rem',
                                            height: '100%',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <div className="group-name">
                                            {group.gName}
                                        </div>

                                        {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                                            msg.msg 띄워주기  */}
                                        {Array.isArray(recentMsg) &&
                                            recentMsg
                                                ?.filter(
                                                    (recent: any) =>
                                                        recent.gSeq ===
                                                        group.gSeq
                                                )
                                                ?.map((filteredRecent: any) => (
                                                    <span className="preview">
                                                        {filteredRecent.msg.msg}
                                                    </span>
                                                ))}
                                    </div>

                                    <div
                                        className="chat-list-count-wrapper"
                                        // onClick={alarmHandler}
                                    >
                                        {Array.isArray(recentMsg) &&
                                            recentMsg
                                                ?.filter(
                                                    (recent: any) =>
                                                        recent.gSeq ===
                                                        group.gSeq
                                                )
                                                ?.map((filteredRecent: any) => (
                                                    <p>
                                                        {
                                                            filteredRecent.msg
                                                                .timeStamp
                                                        }
                                                    </p>
                                                ))}

                                        {/* 0이 아닌 경우, 미확인 메세지 수 확인 가능 */}
                                        {localStorage.getItem(
                                            `gSeq${group.gSeq}`
                                        ) !== '0' && (
                                            <span className="chat-list-count">
                                                {/* 미확인 메세지 개수 */}
                                                {localStorage.getItem(
                                                    `gSeq${group.gSeq}`
                                                )}
                                            </span>
                                        )}
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

                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        height: '100%',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div className="group-name">
                                        {group.gName}
                                    </div>

                                    {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                                            msg.msg 띄워주기  */}
                                    {Array.isArray(recentMsg) &&
                                        recentMsg
                                            ?.filter(
                                                (recent: any) =>
                                                    recent.gSeq === group.gSeq
                                            )
                                            ?.map((filteredRecent: any) => (
                                                <span className="preview">
                                                    {filteredRecent.msg.msg}
                                                </span>
                                            ))}
                                </div>

                                <div
                                    className="chat-list-count-wrapper"
                                    // onClick={alarmHandler}
                                >
                                    {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                                            msg.timeStamp 띄워주기  */}
                                    {Array.isArray(recentMsg) &&
                                        recentMsg
                                            ?.filter(
                                                (recent: any) =>
                                                    recent.gSeq === group.gSeq
                                            )
                                            ?.map((filteredRecent: any) => (
                                                <p>
                                                    {
                                                        filteredRecent.msg
                                                            .timeStamp
                                                    }
                                                </p>
                                            ))}

                                    {/* 0이 아닌 경우, 미확인 메세지 수 확인 가능 */}
                                    {localStorage.getItem(
                                        `gSeq${group.gSeq}`
                                    ) !== '0' && (
                                        <span className="chat-list-count">
                                            {/* 미확인 메세지 개수 */}
                                            {localStorage.getItem(
                                                `gSeq${group.gSeq}`
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
