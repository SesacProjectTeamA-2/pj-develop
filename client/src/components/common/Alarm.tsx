import React from 'react';
import '../../styles/scss/components/alarm.scss';

export default function Alarm({ alarmHandler }: any) {
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
                    <div className="notification">
                        <div className="circle"></div>
                        <span className="time">9:24 AM</span>
                        <button>읽음</button>

                        {/* hover 시, 읽음 표시 */}
                        {/* <svg
                            fill="#4264dd9e"
                            viewBox="0 0 16 16"
                            height="1.4em"
                            width="1.4em"
                            className="check-icon"
                        >
                            <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-3.97-3.03a.75.75 0 00-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-.01-1.05z" />
                        </svg>
                        <span className="check-text">읽음 표시</span> */}
                        <p>
                            <b>John Walker</b> posted a photo on your wall.
                        </p>
                    </div>
                    <div className="notification">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
