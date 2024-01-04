import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';
import { Cookies } from 'react-cookie';

import SwiperComponent from '../../components/group/SwiperComponent';

export default function GroupList() {
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

            setMadeGroup(data.groupInfo);
            // setMadeGroup(data);

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
            setJoinGroup(data.groupInfo);
            // setJoinGroup(data);
            setJoinNumGroup(data.groupUserCount);
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    };

    useEffect(() => {
        getJoinedGroup();
        // console.log('madeGroup', madeGroup);
    }, []);

    return (
        <div>
            {/* === 변경 === */}
            <div className="groups created">
                <div className="title3"> 생성한 모임 </div>
                <div>
                    {madeGroup?.length > 0 ? (
                        <SwiperComponent
                            groupArray={madeGroup}
                            memberCount={madeNumGroup}
                            color1="#fff7c3a6"
                            color2="#e0e0e0"
                            // color2="#ffde04"
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
                        memberCount={joinNumGroup}
                        // color1="#ffbccd"
                        color1="#ffcdda69"
                        color2="#e0e0e0"
                    />
                ) : (
                    '가입한 모임이 없습니다. '
                )}
            </div>
            {joinGroup?.length > 0 ? (
                <></>
            ) : (
                <div style={{ height: '16rem' }}></div>
            )}

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

            {/* </Link> */}
            {/* </div> */}
        </div>
    );
}
