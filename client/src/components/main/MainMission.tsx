import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import { Paper } from '@mui/material';

import '../../styles/scss/pages/main/mainmission.scss';
import { Link } from 'react-router-dom';

export default function MainMission() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [uName, setUName] = useState('');
    const [uCharImg, setCharImg] = useState('');
    const [missionArray, setMissionArray] = useState([]);
    const [groupArray, setGroupInfo] = useState<any>([]);

    const getMissionMain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/mission/user`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('*************', res.data);

                const { missionArray, groupArray, uName, uCharImg } = res.data;
                setMissionArray(missionArray);
                setGroupInfo(groupArray);
                setUName(uName);
                setCharImg(uCharImg);
            });
    };

    useEffect(() => {
        // if (cookie.get('isUser')) {
        getMissionMain();
        // }
    }, [uToken]);

    return (
        <Paper elevation={3} className="content-grid-box">
            <div className="main-mission-div">
                <div className="title4" style={{ marginBottom: '15px' }}>
                    미션 달성하러 가볼까요?
                </div>

                <div className="1">
                    {missionArray?.length > 0 ? (
                        <div className="2">
                            {missionArray?.map((info: any, idx: number) => {
                                return (
                                    <div
                                        className="3"
                                        style={{
                                            padding: '1rem',
                                        }}
                                    >
                                        {/* <div className="title5">
                                            <span
                                                style={{
                                                    color: '#ed8d8d',
                                                    marginRight: '5px',
                                                }}
                                            >
                                                모임명
                                            </span>
                                            {info.gName}
                                        </div> */}
                                        <div>
                                            <div className="group-name-computer">
                                                <div>
                                                    <h1 className="glowFlicker">
                                                        {info.gName}
                                                    </h1>
                                                </div>
                                            </div>
                                            {/* <img
                                                src="asset/images/computer.png"
                                                alt="컴퓨터"
                                                className="com-img"
                                            /> */}
                                        </div>
                                        {info.tb_missions?.map((item: any) => (
                                            <div>
                                                <Link
                                                    to={`/board/create/${info.gSeq}/mission/${item.mSeq}`}
                                                    className="mission-grid"
                                                >
                                                    <button className="learn-more">
                                                        {item.mTitle}
                                                    </button>
                                                </Link>
                                            </div>
                                        ))}
                                        <br />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="title5">해야할 미션이 없어요</div>
                    )}
                </div>
            </div>
        </Paper>
    );
}
