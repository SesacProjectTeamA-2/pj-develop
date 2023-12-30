import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import { MissionStateType, RootStateType } from '../../types/types';
import MissionItem from './MissionItem';
import GroupFilterTag from './GroupFilterTag';
// import { useSelector } from 'react-redux';
// import useDdayCount from '../../hooks/useDdayCount';

export default function MissionList() {
    type MissionType = {
        id: number;
        name: string;
        description: string;
        level: number;
        completed: boolean;
    }[];
    const [groups, setGroups] = useState<any>([]);
    const [missions, setMissions] = useState<MissionType>([
        {
            id: 1,
            name: 'string',
            description: 'string',
            level: 3,
            completed: true,
        },
    ]);

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const getSearchGroupList = async () => {
        const res = await axios
            .get(
                // 유저 미션 조회
                `${process.env.REACT_APP_DB_HOST}/mission/user`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                // const { groupInfo } = res.data;
                // setGroups(groupInfo[0]);
                console.log('검색결과', res.data);
                // console.log(groups.tb_group.gName);
            });

        // setMissions(res.data);
    };

    useEffect(() => {
        getSearchGroupList();
    }, []); // 빈 의존성 배열 : 컴포넌트가 마운트될 때 한 번만 실행

    // console.log(missions);

    // // redux
    // const missions = useSelector((state: RootStateType) => state.mission);
    // const group = useSelector((state: RootStateType) => state.dummyGroup);

    return (
        <div className="list">
            <h1>MissionList </h1>
            <GroupFilterTag />

            <ul className="mission-item-ul1">
                <div className="MissionList-header">
                    {/* <div className="title4">{groups.tb_group.gName}</div> */}

                    {/* <div className="title5">{useDdayCount(group.gDday)}</div> */}
                </div>
                {/* missions.map((mission: MissionStateType) => ( */}
                {/* <MissionItem */}
                {/* // key={mission.id}
                        // mission={mission}
                        // toggleComplete={toggleComplete} */}
                {/* /> */}
                {/* )) */}
            </ul>

            <ul className="mission-item-ul2">
                <div className="MissionList-header">
                    <div className="title4">근손실방지</div>
                    <div className="title5">D-3</div>
                </div>

                {/* missions.map((mission: MissionStateType) => (
                    <MissionItem
                        key={mission.id}
                        mission={mission}
                        // toggleComplete={toggleComplete}
                    />
                )) */}
            </ul>
        </div>
    );
}
