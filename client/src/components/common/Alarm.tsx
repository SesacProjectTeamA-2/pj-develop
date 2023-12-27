import React from 'react';
import '../../styles/scss/components/alarm.scss';

export default function Alarm({ alarmHandler, alarmList }: any) {
    console.log(alarmList);

    // alarmList 배열을 순회하면서 데이터 가공
    const formattedAlarms = alarmList.map((alarm: any) => {
        // 각 알람 항목에서 commentTime을 Date 객체로 변환
        const date = new Date(alarm.commentTime);

        // 시간을 24시간 형식으로 변환
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        // 가공된 데이터를 새로운 객체로 반환
        return {
            ...alarm,
            commentTime: formattedTime,
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
                    {/* map 돌리기 ! */}
                    {alarmList?.map((alarm: any) => {
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
                                    <button>읽음</button>
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

                    {/* <div className="notification">
                        <div className="circle"></div>

                        <span className="time">8:19 AM</span>
                        <button>읽음</button>
                        <p>
                            <b>Alice Parker</b> commented your last post.
                        </p>
                    </div>
                    <div className="notification">
                        <div className="circle"></div>

                        <span className="time">Yesterday</span>
                        <button>읽음</button>
                        <p>
                            <b>Luke Wayne</b> followed you.
                        </p>
                    </div>
                    <div className="notification">
                        <div className="circle"></div>

                        <span className="time">Yesterday</span>
                        <button>읽음</button>
                        <p>
                            <b>Luke Wayne</b> followed you.
                        </p>
                    </div>
                    <div className="notification">
                        <div className="circle"></div>

                        <span className="time">Yesterday</span>
                        <button>읽음</button>
                        <p>
                            <b>Luke Wayne</b> followed you.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
