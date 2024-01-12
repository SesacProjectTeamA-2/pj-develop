import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios, { all } from 'axios';
import { Link } from 'react-router-dom';

import '../../../styles/scss/components/chatlist.scss';
import { FormControlLabel, Stack, Typography } from '@mui/material';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

export default function ChatList({
    isEnter,
    setIsEnter,
    setNowGSeq,
    setNowGName,
    showChatting,
    recentMsg,
    socket,
    setRecentMsg,
    allGroupInfo,
    setAllGroupInfo,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [gSeqList, setGSeqList] = useState<any>([]); // 참여 모임

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

    const [madeGroupInfo, setMadeGroupInfo] = useState<any>([]);
    const [madeJoinInfo, setJoinGroupInfo] = useState<any>([]);

    //++ 채팅방 목록 가져오는 로직 - 하나의 함수에 처리
    const fetchData = async () => {
        try {
            //) 1. 전체 그룹 조회 요청
            const userMissionRes = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/mission/user`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            console.log('유저 미션 조회 >> ', userMissionRes.data);

            const { groupInfo } = userMissionRes.data;

            //) 2. 최신 메세지 조회 요청
            // Fetch recent messages
            const roomInfoRes = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/chat/roomInfo`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            console.log(roomInfoRes.data.roomInfoArray);
            const { roomInfoArray } = roomInfoRes.data;

            // Convert timestamps
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

            // console.log('roomInfoArray???????', roomInfoArray);

            const sortedAllGroupInfo = [...groupInfo].sort((a, b) => {
                let unreadMsgCountA = localStorage.getItem(`gSeq${a.gSeq}`);

                const getTimeStamp = (data: any) =>
                    roomInfoArray.find((item: any) => item.gSeq === data.gSeq)
                        ?.msg.timeStamp;

                const timeStampA = roomInfoArray.some(
                    (data: any) => data.gSeq === a.gSeq
                )
                    ? getTimeStamp(a)
                    : undefined;

                const timeStampB = roomInfoArray.some(
                    (data: any) => data.gSeq === b.gSeq
                )
                    ? getTimeStamp(b)
                    : undefined;

                return unreadMsgCountA !== '0'
                    ? -1
                    : // 2) 2번째 정렬 : 최신순
                    new Date(timeStampB).getTime() -
                      new Date(timeStampA).getTime()
                    ? 1
                    : new Date(timeStampA).getTime() -
                      new Date(timeStampB).getTime()
                    ? -1
                    : // 3) 3번째 정렬 : 최신 메세지 존재 O
                    timeStampA
                    ? -1
                    : 0;
            });

            setAllGroupInfo(sortedAllGroupInfo);
            console.log('sortedAllGroupInfo>>>>>>>', sortedAllGroupInfo);

            let updatedGSeqList: any = [];

            for (let i = 0; i < sortedAllGroupInfo?.length; i++) {
                updatedGSeqList.push(sortedAllGroupInfo[i].gSeq);
            }

            setGSeqList(updatedGSeqList);
            // console.log('ggggggg>>>>>>>', updatedGSeqList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //] 전체 모임
    // const getMissionMain = async () => {
    //     const res = await axios
    //         .get(`${process.env.REACT_APP_DB_HOST}/mission/user`, {
    //             headers: {
    //                 Authorization: `Bearer ${uToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             console.log('유저 미션 조회 >> ', res.data);

    //             const { groupInfo } = res.data;

    //             //; 정렬
    //             const sortedAllGroupInfo = [...groupInfo].sort((a, b) => {
    //                 //-- 1) 미확인 메세지 존재
    //                 let unreadMsgCountA = localStorage.getItem(`gSeq${a.gSeq}`);

    //                 return (
    //                     // 1) 1번째 정렬 : 미확인 메세지 존재 O
    //                     unreadMsgCountA !== '0' ? -1 : 0
    //                 );
    //             });

    //             setAllGroupInfo(sortedAllGroupInfo);
    //         });
    // };

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
                // setAllGroupInfo(groupInfo);
            });
    };

    console.log('allGroupInfo>>>>', allGroupInfo);

    //] 최신 메세지 가져오기
    // const getRecentMsg = async () => {
    //     const res = await axios
    //         .get(`${process.env.REACT_APP_DB_HOST}/chat/roomInfo`, {
    //             headers: {
    //                 Authorization: `Bearer ${uToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             console.log(res.data.roomInfoArray);
    //             const { roomInfoArray } = res.data;

    //             // 시간 변환
    //             const formattedData = roomInfoArray?.map((msgObj: any) => ({
    //                 ...msgObj,
    //                 msg: {
    //                     ...msgObj.msg,
    //                     timeStamp: new Date(
    //                         msgObj.msg.timeStamp
    //                     ).toLocaleTimeString([], {
    //                         hour: 'numeric',
    //                         minute: '2-digit',
    //                         hour12: true,
    //                     }),
    //                 },
    //             }));

    //             setRecentMsg(formattedData);

    //             console.log('최신 allGroupInfo>>>>', allGroupInfo);

    //             //; 최신순으로 allGroupInfo 정렬
    //             // if (allGroupInfo?.length > 0) {
    //             const sortedAllGroupInfo = [...allGroupInfo].sort((a, b) => {
    //                 //-- 1) 미확인 메세지 존재
    //                 let unreadMsgCountA = localStorage.getItem(`gSeq${a.gSeq}`);
    //                 //  let unreadMsgCountB = localStorage.getItem(`gSeq${b.gSeq}`)

    //                 const getTimeStamp = (data: any) =>
    //                     roomInfoArray.find(
    //                         (item: any) => item.gSeq === data.gSeq
    //                     )?.msg.timeStamp;

    //                 const timeStampA = roomInfoArray.some(
    //                     (data: any) => data.gSeq === a.gSeq
    //                 )
    //                     ? getTimeStamp(a)
    //                     : undefined;

    //                 const timeStampB = roomInfoArray.some(
    //                     (data: any) => data.gSeq === b.gSeq
    //                 )
    //                     ? getTimeStamp(b)
    //                     : undefined;

    //                 //-- 1) 1번째 정렬 : 미확인 메세지 존재 O
    //                 //-- 2) 2번째 정렬 : 최신순
    //                 //-- 3) 3번째 정렬 : 최신 메세지 존재 O
    //                 return (
    //                     // 1) 1번째 정렬 : 미확인 메세지 존재 O
    //                     unreadMsgCountA !== '0'
    //                         ? -1
    //                         : // 2) 2번째 정렬 : 최신순
    //                         new Date(timeStampB).getTime() -
    //                           new Date(timeStampA).getTime()
    //                         ? 1
    //                         : timeStampA &&
    //                           timeStampB &&
    //                           new Date(timeStampA).getTime() -
    //                               new Date(timeStampB).getTime()
    //                         ? -1
    //                         : // 3) 3번째 정렬 : 최신 메세지 존재 O
    //                           //: timeStampA
    //                           // ? -1
    //                           0
    //                 );
    //             });

    //             setAllGroupInfo(sortedAllGroupInfo);
    //             console.log('sortedAllGroupInfo>>>>>>>', sortedAllGroupInfo);
    //         });
    // };

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
                // setAllGroupInfo((prev: any) => [...prev, ...groupInfo]);
            });
    };

    useEffect(() => {
        //* 하나로 합침
        fetchData();

        // getMissionMain(); // 전체 그룹 조회

        // //) 비동기 문제를 해결하기 위해 조건을 추가함
        // // 이전에는 allGroupInfo가 뒤늦게 도착하여 빈 배열이 찍혀, 최신순으로 나열되지 않았으나,
        // // 조건문을 추가함으로써, allGroupInfo가 빈 배열이 아닌 경우에만 해당 동작 수행
        // // 조건이 만족되면 최신 메세지 가져오는 작업 수행 (순서대로 처리됨)
        // // allGroupInfo?.length && getRecentMsg();
        // allGroupInfo?.length && getRecentMsg();

        getMadeGroup();
        getJoinedGroup();
    }, []);

    const enterChatRoom = (gSeq: number, gName: string) => {
        setNowGSeq(gSeq);
        setNowGName(gName);
        setIsEnter(true);
    };

    console.log('allGroupInfo>>>>>>', allGroupInfo);
    console.log('isEnter>>>>>>', isEnter);

    useEffect(() => {
        if (!isEnter) {
            socket?.emit('roomInfo', { isOut: '' });

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

        console.log('gSeqList>>>>>>>>>', gSeqList);
    }, []);

    useEffect(() => {
        if (gSeqList?.length > 0) {
            // console.log('********** updatedGSeqList **********', gSeqList);

            socket?.emit('joinRoom', { gSeq: gSeqList });
        }
    }, [gSeqList]);

    console.log('ChatList에서 recentMsg', recentMsg);

    //] toggle

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    // backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    //     '#fff'
                    // )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,

                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="18" viewBox="0 0 15 15"><path fill="${encodeURIComponent(
                        '#fff'
                    )}" d="M4.243 4.757a3.757 3.757 0 115.851 3.119 6.006 6.006 0 013.9 5.339.75.75 0 01-.715.784H2.721a.75.75 0 01-.714-.784 6.006 6.006 0 013.9-5.34 3.753 3.753 0 01-1.664-3.118z"/></svg>')`,
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor:
                        theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor:
                theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
            width: 32,
            height: 32,
            '&::before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"> <path fill="${encodeURIComponent(
                    '#fff'
                )}" d="M7 10h5v5H7m12 4H5V8h14m0-5h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>')`,
            },
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor:
                theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            borderRadius: 20 / 2,
        },
    }));

    const [key, setKey] = useState(0); // key 상태 추가

    const [leaderSorted, setLeaderSorted] = useState(false); // 정렬 기준
    // false: 최신순
    // true: 리더순

    const sortedHandler = (e: any) => {
        console.log(e.target.checked);
        setLeaderSorted((prevLeaderSorted) => !prevLeaderSorted);
    };

    // const toggleClickHandler = () => {
    //     setLeaderSorted((prevLeaderSorted) => !prevLeaderSorted);
    // };

    console.log('leaderSorted', leaderSorted);

    return (
        <div className="chat-list-wrapper" key={key}>
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

            {/* <div></div> */}

            <div className="list-sort-toggle-wrapper">
                <span>최신순</span>

                <FormControlLabel
                    // control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                    control={
                        <MaterialUISwitch
                            sx={{ m: 1 }}
                            style={{ overflow: 'visible' }}
                            defaultChecked={leaderSorted}
                            // onChange={sortedHandler}
                            // onClick={toggleClickHandler}
                        />
                    }
                    label="Leader"
                    onChange={sortedHandler}
                />
            </div>

            <ul>
                <div key={key}>
                    {/* --- 리더 & 멤버 구분 ---  */}
                    {leaderSorted ? (
                        <div key={key}>
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
                                    <button className="group-attend-btn">
                                        <Link to="/group">
                                            모임 참여하러 가기
                                        </Link>
                                    </button>
                                </div>
                            ) : (
                                //=== 리더 & 멤버 ===
                                madeGroupInfo?.map(
                                    (group: any, idx: number) => {
                                        return (
                                            <li
                                                className="group-list"
                                                onClick={() =>
                                                    enterChatRoom(
                                                        group.gSeq,
                                                        group.gName
                                                    )
                                                }
                                            >
                                                <div className="list-content-wrapper">
                                                    {/* <img
                                                        src="/asset/images/leader.gif"
                                                        alt=""
                                                    /> */}
                                                    {/* [추후변경] 그룹명의 앞글자만 따옴 */}
                                                    <div
                                                        className="list-img-circle"
                                                        style={{
                                                            backgroundColor:
                                                                '#2a2a2a',
                                                            color: '#f5df60',
                                                            width: '5rem',
                                                            height: '3rem',
                                                        }}
                                                    >
                                                        {group.gName.slice(
                                                            0,
                                                            1
                                                        )}
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            // width: '100%',
                                                            width: '6rem',
                                                            height: '100%',
                                                            flexDirection:
                                                                'column',
                                                        }}
                                                    >
                                                        <div className="group-name">
                                                            {group.gName}
                                                        </div>

                                                        {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                            msg.msg 띄워주기  */}
                                                        {Array.isArray(
                                                            recentMsg
                                                        ) &&
                                                            recentMsg
                                                                ?.filter(
                                                                    (
                                                                        recent: any
                                                                    ) =>
                                                                        recent.gSeq ===
                                                                        group.gSeq
                                                                )
                                                                ?.map(
                                                                    (
                                                                        filteredRecent: any
                                                                    ) => (
                                                                        <span className="preview">
                                                                            {
                                                                                filteredRecent
                                                                                    .msg
                                                                                    .msg
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                    </div>

                                                    <div
                                                        className="chat-list-count-wrapper"
                                                        // onClick={alarmHandler}
                                                    >
                                                        {Array.isArray(
                                                            recentMsg
                                                        ) &&
                                                            recentMsg
                                                                ?.filter(
                                                                    (
                                                                        recent: any
                                                                    ) =>
                                                                        recent.gSeq ===
                                                                        group.gSeq
                                                                )
                                                                ?.map(
                                                                    (
                                                                        filteredRecent: any
                                                                    ) => (
                                                                        <p>
                                                                            {
                                                                                filteredRecent
                                                                                    .msg
                                                                                    .timeStamp
                                                                            }
                                                                        </p>
                                                                    )
                                                                )}

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
                                    }
                                )
                            )}
                            {madeJoinInfo?.map((group: any, idx: number) => {
                                return (
                                    <li
                                        className="group-list"
                                        onClick={() =>
                                            enterChatRoom(
                                                group.gSeq,
                                                group.gName
                                            )
                                        }
                                    >
                                        <div className="list-content-wrapper">
                                            {/* <img
                                                src="/asset/images/member.gif"
                                                alt=""
                                            /> */}
                                            <div
                                                className="list-img-circle"
                                                style={{
                                                    backgroundColor: '#f88c99',
                                                    width: '7rem',
                                                    height: '3rem',
                                                }}
                                            >
                                                {group.gName.slice(0, 1)}
                                            </div>

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
                                                                recent.gSeq ===
                                                                group.gSeq
                                                        )
                                                        ?.map(
                                                            (
                                                                filteredRecent: any
                                                            ) => (
                                                                <span className="preview">
                                                                    {
                                                                        filteredRecent
                                                                            .msg
                                                                            .msg
                                                                    }
                                                                </span>
                                                            )
                                                        )}
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
                                                                recent.gSeq ===
                                                                group.gSeq
                                                        )
                                                        ?.map(
                                                            (
                                                                filteredRecent: any
                                                            ) => (
                                                                <p>
                                                                    {
                                                                        filteredRecent
                                                                            .msg
                                                                            .timeStamp
                                                                    }
                                                                </p>
                                                            )
                                                        )}

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
                        </div>
                    ) : (
                        //=== 최신순 ===
                        <div key={key}>
                            {/* --- 전체 모임 --- */}
                            {/* [추후] 전체 모임 없는 경우 추가 */}

                            {!madeGroupInfo && !madeJoinInfo ? (
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        color: 'gray',
                                        paddingTop: '2rem',
                                    }}
                                >
                                    <span className="no-chat-room-text">
                                        현재 참여한 채팅방이 없어요 !
                                    </span>
                                    <button className="group-attend-btn">
                                        <Link to="/group">
                                            모임 참여하러 가기
                                        </Link>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {allGroupInfo?.map(
                                        (group: any, idx: number) => {
                                            return (
                                                <li
                                                    className="group-list"
                                                    onClick={() =>
                                                        enterChatRoom(
                                                            group.gSeq,
                                                            group.tb_group.gName
                                                        )
                                                    }
                                                >
                                                    <div className="list-content-wrapper">
                                                        {/* <img
                                                            src="/asset/images/leader.gif"
                                                            alt=""
                                                        /> */}
                                                        <div
                                                            className="list-img-circle"
                                                            style={{
                                                                backgroundColor:
                                                                    '#848f9b',
                                                                // color: '#444444',
                                                                width: '5rem',
                                                                height: '3rem',
                                                            }}
                                                        >
                                                            {group.tb_group.gName.slice(
                                                                0,
                                                                1
                                                            )}
                                                        </div>

                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                // width: '100%',
                                                                width: '6rem',
                                                                height: '100%',
                                                                flexDirection:
                                                                    'column',
                                                            }}
                                                        >
                                                            <div className="group-name">
                                                                {
                                                                    group
                                                                        .tb_group
                                                                        .gName
                                                                }
                                                            </div>

                                                            {/* recentMsg[i].gSeq와 group[i].gSeq와 동일하면,
                                        msg.msg 띄워주기  */}
                                                            {Array.isArray(
                                                                recentMsg
                                                            ) &&
                                                                recentMsg
                                                                    ?.filter(
                                                                        (
                                                                            recent: any
                                                                        ) =>
                                                                            recent.gSeq ===
                                                                            group.gSeq
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            filteredRecent: any
                                                                        ) => (
                                                                            <span className="preview">
                                                                                {
                                                                                    filteredRecent
                                                                                        .msg
                                                                                        .msg
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                        </div>

                                                        <div
                                                            className="chat-list-count-wrapper"
                                                            // onClick={alarmHandler}
                                                        >
                                                            {Array.isArray(
                                                                recentMsg
                                                            ) &&
                                                                recentMsg
                                                                    ?.filter(
                                                                        (
                                                                            recent: any
                                                                        ) =>
                                                                            recent.gSeq ===
                                                                            group.gSeq
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            filteredRecent: any
                                                                        ) => (
                                                                            <p>
                                                                                {
                                                                                    filteredRecent
                                                                                        .msg
                                                                                        .timeStamp
                                                                                }
                                                                            </p>
                                                                        )
                                                                    )}

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
                                        }
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </ul>
        </div>
    );
}
