import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { Cookies } from 'react-cookie';

import SwiperComponent from '../../components/group/SwiperComponent';
import SwiperTest from 'src/components/group/SwiperTest';

export default function GroupList() {
    const nvg = useNavigate();

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [madeGroup, setMadeGroup] = useState([]);
    const [madeNumGroup, setMadeNumGroup] = useState([]);
    const [joinGroup, setJoinGroup] = useState([]);
    const [joinNumGroup, setJoinNumGroup] = useState([]);

    //] 생성한 모임
    const getMadeGroup = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/group/made`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );
            const data = response.data;

            console.log('생성한 모임', data);

            // setMadeGroup(data.groupInfo);
            setMadeGroup(data);

            setMadeNumGroup(data.groupUserCount);

            // console.log('gCategory>>>', data.gCategory);
            // console.log('setMadeNumGroup>>>', data.groupUserCount);
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    };

    useEffect(() => {
        getMadeGroup();
    }, []);

    //] 참여한 모임
    const getJoinedGroup = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/group/joined`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );
            const data = response.data;
            console.log('참여한 모임', data);
            // setJoinGroup(data.groupInfo);
            setJoinGroup(data);
            setJoinNumGroup(data.groupUserCount);
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    };

    useEffect(() => {
        getJoinedGroup();
        // console.log('madeGroup', madeGroup);
    }, []);

    const createHandler = () => {
        if (!uToken) {
            alert('로그인이 필요합니다 !');
            return;
        } else nvg('/group/create');
    };

    return (
        <div>
            {/* === 변경 === */}
            <div className="groups created">
                <div className="title3"> 생성한 모임 </div>
                <div>
                    {madeGroup?.length > 0 ? (
                        <SwiperComponent
                            groupArray={madeGroup}
                            madeNumGroup={madeNumGroup}
                            color1="#ff9400"
                            color2="#ffde04"
                        />
                    ) : (
                        '생성한 모임이 없습니다. '
                    )}
                </div>
            </div>

            <div className="groups join">
                <div className="title3">참여한 모임</div>

                {joinGroup?.length > 0 ? (
                    <SwiperComponent
                        groupArray={joinGroup}
                        // setGroupArray={setJoinGroup}
                        joinNumGroup={joinNumGroup}
                        color1="#ffbccd"
                        color2="#ff7575"
                    />
                ) : (
                    '가입한 모임이 없습니다. '
                )}
            </div>

            {/* --- 이전 코드 --- */}
            {/* <div className="groups created"> */}
            {/* <div className="title3"> TEST </div> */}
            {/* <div> */}
            {/* {madeGroup?.length > 0 ? ( */}
            {/* <SwiperTest groupArray={madeGroup} /> */}
            {/* ) : (
                '생성한 모임이 없습니다. '
            )} */}
            {/* </div> */}
            {/* </div> */}

            {/* <div className="groups recommend">
                <div className="title1">이런 모임 어떠세요 ?</div>
                <button>추천모임1</button>
            </div> */}
            {/* <div className="btn-fixed-wrapper"> */}
            {/* <Link to="/group/create"> */}
            <div className="btn-fixed-wrapper">
                {/* <button className="btn-fixed" onClick={createHandler}> */}
                {/* <button className="btn-fixed-floating" onClick={createHandler}>
                    내가 모임 만들기 !
                </button> */}
                <button className="btn-fixed-rl" onClick={createHandler}>
                    <span className="shadow">
                        <span className="vert">
                            <span className="floating">
                                <span className="front">
                                    원하는 모임이 없나요 ?
                                </span>
                                <span className="back">직접 만들러 가요 !</span>
                            </span>
                        </span>
                    </span>
                </button>
                {/* <span className="btn-fixed-floating-shadow"></span> */}
            </div>
            {/* </Link> */}
            {/* </div> */}
        </div>
    );
}
