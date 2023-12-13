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
                        <p>
                            <b>John Walker</b> posted a photo on your wall.
                        </p>
                    </div>
                    <div className="notification">
                        <div className="circle"></div>
                        <span className="time">8:19 AM</span>
                        <p>
                            <b>Alice Parker</b> commented your last post.
                        </p>
                    </div>
                    <div className="notification">
                        <div className="circle"></div>
                        <span className="time">Yesterday</span>
                        <p>
                            <b>Luke Wayne</b> followed you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
