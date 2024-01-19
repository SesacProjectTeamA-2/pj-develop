import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';

import {
    MissionListType,
    MissionStateType,
    MissionType,
    RootStateType,
} from '../../../types/types';

import MissionAddModal from '../../common/modal/MissionAddModal';

export default function HomeMissionList({
    missionList,
    setMissionList,
    gDday,
    isLeader,
    groupDetail,
    setKey,
}: any) {
    const [addModalSwitch, setAddModalSwitch] = useState(false);
    const missionAddHandler = () => {
        setAddModalSwitch(true);
    };

    //-- redux 상태관리
    // const dummyGroupState = useSelector(
    //     (state: RootStateType) => state.dummyGroup
    // );

    // const missionList = useSelector(
    //     (state: RootStateType) => state.dummyGroup.missionArray
    // );

    const missionState = useSelector((state: RootStateType) => state.mission);

    const [missionInput, setMissionInput] = useState({
        id: missionList?.length + 1,
        mTitle: '',
        mContent: '',
        mLevel: 1,
    });

    const [missionInputs, setMissionInputs] = useState<any>(
        // Array.isArray(missionList) &&
        missionList?.map((mission: any) => ({
            id: mission.id,
            mTitle: mission.mTitle,
            mContent: mission.mContent,
            mLevel: mission.mLevel,
        })) || []
    );

    // 함수 추가한 부분
    const handleMissionContentChange = (missionId: any, newContent: any) => {
        // missionId에 해당하는 미션의 내용을 newContent로 변경
        const updatedMissionList = missionList.map((mission: any) => {
            if (mission.id === missionId) {
                return { ...mission, mContent: newContent };
            } else {
                return mission;
            }
        });
        setMissionList(updatedMissionList);
    };

    const editHandler = (targetId: number) => {
        const editedMissionIndex = missionInputs.findIndex(
            (mission: any) => mission.id === targetId
        );

        if (editedMissionIndex !== -1) {
            // 수정할 미션을 찾았을 때, 해당 미션 정보 수정
            const updatedMissionInputs = [...missionInputs];
            updatedMissionInputs[editedMissionIndex] = {
                ...updatedMissionInputs[editedMissionIndex],
                mTitle: missionInput.mTitle,
                mContent: missionInput.mContent,
                mLevel: missionInput.mLevel,
            };
            setMissionInputs(updatedMissionInputs);
        }
    };

    const deleteHandler = (targetId: number) => {
        const filtered = missionList.filter(
            (mission: any) => targetId !== mission.id
        );
        console.log('HOME targetId, filtered', targetId, filtered);
        setMissionList(filtered);
    };
    console.log('missionList HOME', missionList);

    // 난이도 계산
    for (let mission of missionList || []) {
        switch (mission.mLevel) {
            case 5: {
                mission.mStar = '⭐️⭐️⭐️';
                break;
            }
            case 3: {
                mission.mStar = '⭐️⭐️';
                break;
            }
            case '1': {
                mission.mStar = '⭐️';
                break;
            }
            case 1: {
                mission.mStar = '⭐️';
                break;
            }
            default:
                break;
        }
    }

    return (
        <div className="wrapper">
            <div className="upper-content">
                <div className="upper-content-wrapper">
                    <div className="title5">진행 중인 미션</div>

                    {isLeader ? (
                        <div onClick={missionAddHandler}>
                            <div className="title5 mission-edit">
                                <img
                                    src="/asset/icons/edit.svg"
                                    alt="edit-img"
                                    className="edit-img"
                                ></img>
                                <div className="title8 mission-edit-text">
                                    수정하기
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
                {addModalSwitch ? (
                    <MissionAddModal
                        addModalSwitch={addModalSwitch}
                        setAddModalSwitch={setAddModalSwitch}
                        action={'미션수정'}
                        missionList={missionList}
                        setMissionList={setMissionList}
                        gDday={gDday}
                        groupDetail={groupDetail}
                        setKey={setKey}
                    />
                ) : null}
                <div className="title5">
                    {gDday > 0 ? 'D-' + gDday : gDday === 0 ? 'D-DAY' : ''}
                </div>
            </div>
            <div className="main-content">
                <ul>
                    {Array.isArray(missionList) &&
                        missionList?.map((mission: any, idx: number) => {
                            return (
                                <li key={idx} className="mission-li">
                                    <div className="mission-element">
                                        {mission.mTitle}
                                    </div>
                                    <div>{mission.mContent}</div>
                                    <div>난이도 {mission.mStar}</div>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
}
