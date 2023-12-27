import React, { useEffect } from 'react';
import '../../styles/scss/components/alarm.scss';

export default function Alarm({ alarmHandler, alarmList, commentAlarm }: any) {
    console.log('alarmList', alarmList);
    console.log('commentAlarm', commentAlarm);

    // alarmList 배열을 순회하면서 데이터 가공
    const formattedAlarms = alarmList.map((alarm: any) => {
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

    console.log('formattedAlarms :::', formattedAlarms);

    // {
    //     commentTime: '2023-12-26T05:32:39.378Z';
    //     gbSeq: '18';
    //     type: 'comment';
    //     uName: 'TTTest222222';
    // }

    //] 새로운 알람 추가
    const addReceivedAlarm = (data: any) => {
        // 시간 변환
        const date = new Date(data?.commentTime);

        // 수정된 부분: 시간을 24시간 형식으로 변환
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

        // 새로운 알람 요소를 생성
        const newNotificationDiv = document.createElement('div');
        newNotificationDiv.className = 'notification';

        const circleDiv = document.createElement('div');
        circleDiv.className = 'circle';

        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.alignItems = 'center';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'time';
        timeSpan.textContent = formattedTime;

        const button = document.createElement('button');
        button.textContent = '읽음';
        button.addEventListener('click', readHandler); // 클릭 이벤트 핸들러 추가

        flexContainer.appendChild(timeSpan);
        flexContainer.appendChild(button);

        newNotificationDiv.appendChild(circleDiv);
        newNotificationDiv.appendChild(flexContainer);

        const notificationsContainer = document.querySelector('.comment-alarm');

        if (notificationsContainer) {
            notificationsContainer.appendChild(newNotificationDiv);
        }

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
    };

    useEffect(() => {
        // if (commentAlarm?.length > 0) {
        if (commentAlarm) {
            addReceivedAlarm(commentAlarm);
            console.log('@@@@@@');
        }
    }, [commentAlarm]);

    //] 읽음 처리
    const readHandler = () => {};

    // 선 동적으로 처리
    useEffect(() => {
        const panel = document.querySelector('.panel');

        if (panel) {
            // const notificationBox = document.querySelector(
            //     '.notifications'
            // ) as HTMLDivElement;

            const line = document.querySelector('.line') as HTMLDivElement;

            const notifications = document.querySelectorAll(
                '.panel .notifications .notification'
            );

            // 데이터 수에 따라 동적으로 처리
            for (let i = 0; i < formattedAlarms.length; i++) {
                const notification = notifications[i] as HTMLDivElement;
                // const height = i * 10; // 데이터에 따라 높이 계산

                // 스타일 동적으로 설정
                notification.style.animation = `here-am-i 0.5s ease-out ${
                    i * 0.1
                }s`;
                notification.style.animationFillMode = 'both';
                // line.style.height = `${i * 0.9 * 250}px`;
            }
            line.style.height = `${formattedAlarms.length * 130}px`;
        }
    }, [formattedAlarms]);

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
                    <div className="comment-alarm"></div>

                    {/* [START] alarmList - map 돌리기 ! */}
                    {formattedAlarms?.map((alarm: any) => {
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
                                    <button onClick={readHandler}>읽음</button>
                                </div>

                                {alarm.type == 'comment' ? (
                                    <p>
                                        <b>{alarm.uName}</b> 님이 댓글을
                                        남겼습니다.
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    })}
                    {/* [END] alarmList */}
                </div>
            </div>
        </div>
    );
}
