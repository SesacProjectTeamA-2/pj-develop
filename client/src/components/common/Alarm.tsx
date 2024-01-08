import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import '../../styles/scss/components/alarm.scss';

export default function Alarm({
    setKey,
    alarmHandler,
    alarmList,
    commentAlarm,
    setAlarmCount,
    setAlarmList,
}: // key,
any) {
    console.log('alarmList >>>>>>>', alarmList);
    console.log('commentAlarm >>>>>>>', commentAlarm);

    const [formattedAlarms, setFormattedAlarms] = useState([]);

    // let formattedAlarmsData: any[] = [];

    useEffect(() => {
        // console.log('alarmList ???????', alarmList);

        // alarmList 배열을 순회하면서 데이터 가공
        const formattedAlarmsData = alarmList?.map((alarm: any) => {
            // 각 알람 항목에서 commentTime을 Date 객체로 변환
            const date = new Date(alarm?.commentTime);

            // 시간을 24시간 형식으로 변환
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });

            // 날짜를 형식에 맞게 변환
            const formattedDate = date.toLocaleDateString('en-US', {
                // year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            // 가공된 데이터를 새로운 객체로 반환
            return {
                ...alarm,
                // commentTime: formattedTime,
                commentTime: `${formattedDate} ${formattedTime}`,
                // 다른 필요한 가공 작업 수행
            };
        });

        // 가공된 데이터를 상태로 설정
        setFormattedAlarms(formattedAlarmsData);

        if (alarmList) {
            setAlarmNone(false);
        }

        console.log('실행 ???????');
    }, [alarmList]);

    console.log('formattedAlarms :::', formattedAlarms);

    // {
    //     commentTime: '2023-12-26T05:32:39.378Z';
    //     gbSeq: '18';
    //     type: 'comment';
    //     uName: 'TTTest222222';
    // }

    //] 새로 추가된 알람 읽음 처리
    // const newAddedMsgReadHandler = async () => {

    //     const res = await axios
    //         .delete(`${process.env.REACT_APP_DB_HOST}/subscribe/alarm`, {
    //             // 삭제할 데이터 전송
    //             // commentInfo,
    //             headers: {
    //                 Authorization: `Bearer ${uToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             console.log(res);
    //         });

    // };

    // const [newAlarm, setNewAlarm] = useState(false); // 새로운 알람이 왔는지 여부

    //] 새로운 알람 추가
    // const addReceivedAlarm = (data: any) => {
    //     setNewAlarm(true);

    //     // 시간 변환
    //     const date = new Date(data?.commentTime);

    //     // 수정된 부분: 시간을 24시간 형식으로 변환
    //     const formattedTime = date.toLocaleTimeString('en-US', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     });

    //     // 날짜를 형식에 맞게 변환
    //     const formattedDate = date.toLocaleDateString('en-US', {
    //         // year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //     });

    //     const notificationsContainer = document.querySelector('.comment-alarm');

    //     if (notificationsContainer) {
    //         // 새로운 알람 요소를 생성
    //         const newNotificationDiv = document.createElement('div');
    //         newNotificationDiv.className = 'notification';

    //         const circleDiv = document.createElement('div');
    //         circleDiv.className = 'circle';

    //         const flexContainer = document.createElement('div');
    //         flexContainer.style.display = 'flex';
    //         flexContainer.style.alignItems = 'center';

    //         const timeSpan = document.createElement('span');
    //         timeSpan.className = 'time';
    //         timeSpan.textContent = `${formattedDate} ${formattedTime}`;

    //         const button = document.createElement('button');
    //         button.textContent = '읽음';
    //         // button.addEventListener('click', newAddedMsgReadHandler); // 클릭 이벤트 핸들러 추가

    //         const nameSpan = document.createElement('p');
    //         nameSpan.innerHTML = ` <div className="alarm-title-text-wrapper"><span className="alarm-title-text" style={{fontWeight: 'bold'}}>${data.title}</span> <span> 게시글에</span></div> <b>${data.uName}</b> 님이 댓글을 남겼습니다.`;

    //         flexContainer.appendChild(timeSpan);
    //         flexContainer.appendChild(button);

    //         newNotificationDiv.appendChild(circleDiv);
    //         newNotificationDiv.appendChild(flexContainer);
    //         newNotificationDiv.appendChild(nameSpan);

    //         // 기존의 자식들 앞에 새로운 알람 요소를 추가
    //         notificationsContainer.insertBefore(
    //             newNotificationDiv,
    //             notificationsContainer.firstChild
    //         );

    //         //   notificationsContainer.appendChild(newNotificationDiv);
    //     }

    // if (alarmWrapper) {
    //     const newElements = commentAlarm.map((alarm, index) => (
    //         <div key={index} className="notification">
    //             <div className="circle"></div>
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 <span className="time">{commentAlarm.commentTime}</span>
    //                 <button onClick={readHandler}>읽음</button>
    //             </div>
    //             {alarm.type === 'comment' ? (
    //                 <p>
    //                     <b>{alarm.uName}</b> 님이 댓글을 남겼습니다.
    //                 </p>
    //             ) : (
    //                 <></>
    //             )}
    //         </div>
    //     ));

    //     // 생성된 엘리먼트를 DOM에 추가합니다.
    //     alarmWrapper.innerHTML = ''; // 현재 내용을 지우고
    //     newElements.forEach((element) => {
    //         alarmWrapper.appendChild(element);
    //     });
    // }
    // };

    // useEffect(() => {
    //     // if (commentAlarm?.length > 0) {
    //     if (commentAlarm) {
    //         // addReceivedAlarm(commentAlarm);

    //         // 업데이트된 알람 반영
    //         updateAlarmHandler();
    //     }
    // }, [commentAlarm]);

    //] 읽음 처리
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [alarmNone, setAlarmNone] = useState(false);
    const [isDeleted, setIsDeleted] = useState<any>(''); // 삭제 처리되는 alarmList의 idx 값

    const deleteAlarm = async (commentInfo: any) => {
        const res = await axios
            .delete(`${process.env.REACT_APP_DB_HOST}/subscribe/alarm`, {
                // 삭제할 데이터 전송
                data: commentInfo,
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('읽음 처리 delete >>>>>>', res.data);
                console.log('읽음 처리 delete >>>>>>', res.data.alarmList);

                // let updateData = [];
                // for (let i = 0; i < res.data.alarmList?.length; i++) {
                //     updateData.push(JSON.parse(res.data.alarmList[i]));
                // }

                // console.log('parsedData:::::', updateData);
                // console.log(
                //     'parsedData>>>>>>>',
                //     JSON.parse(res.data.alarmList)
                // );

                // setAlarmList([...updateData]);
                setAlarmList([...res.data.alarmList]);
            });
    };

    //] 프론트에서 해당 데이터 삭제
    useEffect(() => {
        if (isDeleted !== '') {
            //-- 2. 프론트에서 해당 데이터 삭제
            // const noti = document.querySelector('notification');

            // noti의 자식 요소들을 NodeList로 가져오기
            const notiItems = document.querySelectorAll('.notification');

            // 해당 인덱스의 .notification 요소를 선택
            const specificNotification = notiItems[isDeleted]; // idx

            if (specificNotification) {
                // 선택된 .notification 요소의 모든 자식 요소를 제거
                while (specificNotification.firstChild) {
                    const firstChild = specificNotification.firstChild;
                    if (firstChild) {
                        specificNotification.removeChild(firstChild);
                    }
                }
            }

            //-- 3. 알람 수 -1
            const currentAlarmCount = localStorage.getItem('alarmCount');

            if (currentAlarmCount) {
                // 현재 알람 수를 1 감소시키고 문자열로 변환하여 다시 저장
                const newAlarmCount = (
                    Number(currentAlarmCount) - 1
                ).toString();
                localStorage.setItem('alarmCount', newAlarmCount);
                setAlarmCount(localStorage.getItem('alarmCount')); // 알람 수 업데이트

                // 현재 알람이 없습니다.
                if (newAlarmCount === '0') {
                    setAlarmNone(true);
                }
            }
        }
    }, [isDeleted]);

    const readHandler = async (idx: number) => {
        // 기존 알람 중 클릭한 데이터
        // console.log(formattedAlarms[idx]);

        //-- 1. 서버에 데이터 삭제 요청
        deleteAlarm(alarmList[idx]);

        setIsDeleted(alarmList[idx]);

        console.log('삭제되었나요 ????', alarmList);
    };

    //++ 선 동적으로 처리
    useEffect(() => {
        const panel = document.querySelector('.panel');
        const line = document.querySelector('.line') as HTMLDivElement;

        if (alarmNone) {
            line.style.height = '0';
        } else if (panel) {
            // const notificationBox = document.querySelector(
            //     '.notifications'
            // ) as HTMLDivElement;

            const notifications = document.querySelectorAll(
                '.panel .notifications .notification'
            );

            // 데이터 수에 따라 동적으로 처리
            for (let i = 0; i < formattedAlarms?.length; i++) {
                const notification = notifications[i] as HTMLDivElement;
                // const height = i * 10; // 데이터에 따라 높이 계산

                // 스타일 동적으로 설정
                notification.style.animation = `here-am-i 0.5s ease-out ${
                    i * 0.1
                }s`;
                notification.style.animationFillMode = 'both';
                // line.style.height = `${i * 0.9 * 250}px`;
            }
            line.style.height = `${formattedAlarms?.length * 150}px`;
        }
    }, [formattedAlarms, commentAlarm, alarmList]);

    //] 링크 이동
    const nvg = useNavigate();

    // const [key, setKey] = useState(0); // key 상태 추가

    const linkToHandler = (
        gSeq: any,
        category: string,
        gbSeq: any,
        mSeq: any
    ) => {
        console.log('gSeq', gSeq);
        console.log('category', category);
        console.log('gbSeq', gbSeq);
        console.log('mSeq', mSeq);

        // key 값을 변경하여 리렌더링 유도
        setKey((prevKey: any) => prevKey + 1);

        //~[추후] 추가
        category === 'mission'
            ? nvg(
                  `/board/${Number(gSeq)}/${category}/${Number(mSeq)}/${Number(
                      gbSeq
                  )}`
              )
            : nvg(`/board/${Number(gSeq)}/${category}/${Number(gbSeq)}`);

        // /board/:gSeq/mission/:mSeq/:gbSeq"
    };

    return (
        <div className="alarm-wrapper">
            <div className="panel">
                {/* <div className="header flex">
                    <span className="title">Notifications</span>
                </div> */}

                <div className="notifications clearfix">
                    <div className="line"></div>
                    <svg
                        viewBox="0 0 512 512"
                        fill="currentColor"
                        height="1.5em"
                        width="1.5em"
                        onClick={alarmHandler}
                    >
                        <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
                    </svg>

                    {/* 새로운 알람 추가 */}
                    {/* <div className="comment-alarm"></div> */}

                    {/* [START] alarmList - map 돌리기 ! */}
                    {alarmNone ||
                    !formattedAlarms ||
                    formattedAlarms?.length == 0 ? (
                        <div className="no-alarm-text">
                            현재 알람이 없습니다.
                        </div>
                    ) : (
                        formattedAlarms?.map((alarm: any, idx: number) => {
                            return (
                                <div className="notification">
                                    <div className="circle"></div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span className="time">
                                            {alarm.commentTime}
                                        </span>
                                        <button
                                            onClick={() => {
                                                readHandler(idx);
                                            }}
                                        >
                                            읽음
                                        </button>
                                    </div>

                                    {alarm.type == 'comment' ? (
                                        <p
                                            // className="notification-message-wrapper-p"
                                            onClick={() =>
                                                linkToHandler(
                                                    alarm.gSeq,
                                                    alarm.category,
                                                    alarm.gbSeq,
                                                    alarm.mSeq
                                                )
                                            }
                                        >
                                            {/* <Link
                                                to={`/board/${Number(
                                                    alarm.gSeq
                                                )}/${alarm.category}/${Number(
                                                    alarm.gbSeq
                                                )}`}
                                                className="alarm-link"
                                                key={`${alarm.gSeq}-${alarm.category}-${alarm.gbSeq}`}
                                            > */}
                                            <div className="alarm-title-text-wrapper">
                                                <span className="alarm-title-text">
                                                    {alarm.title}
                                                </span>{' '}
                                                <span> 게시글에</span>
                                            </div>
                                            <span>
                                                <b>{alarm.uName}</b> 님이 댓글을
                                                남겼습니다.
                                            </span>
                                            {/* </Link> */}
                                        </p>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        })
                    )}
                    {/* [END] alarmList */}
                </div>
            </div>
        </div>
    );
}
