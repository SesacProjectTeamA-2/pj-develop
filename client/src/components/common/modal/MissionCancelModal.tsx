import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import Modal from 'react-modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import '../../../styles/scss/components/modal.scss';

import ModalMemberList from './ModalMemberList';
import { useSelector } from 'react-redux';
import {
    GroupMissionsType,
    MissionListType,
    MissionStateType,
    RootStateType,
} from '../../../types/types';

// interface MissionCancelModalProps {
//     missionCancelModalSwitch: boolean;
//     setMissionCancelModalSwitch: (value: boolean) => void;
// }

export default function MissionCancelModal({
    missionCancelModalSwitch,
    setMissionCancelModalSwitch,
}: any) {
    // const missionList = useSelector((state: RootStateType) => state.mission);

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq } = useParams();

    const [groupMissions, setGroupMissions] = useState<GroupMissionsType[]>([]);
    const [groupName, setGroupName] = useState<GroupMissionsType[]>([]);

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setGroupMissions(res.data.groupMission);
                // setGrsoupName(res.data.groupName);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    const [selectedMissionId, setSelectedMissionId] = useState(1);

    // 모달창 닫기
    const closeModalHandler = () => {
        setMissionCancelModalSwitch(false);
    };

    // 미션 타입 선택
    const missionTypeHandler = (id: number) => {
        console.log(id);
        setSelectedMissionId(id);
    };

    // 미션 인증완료 취소 완료
    const missionCancelDone = () => {
        //! [추후] 미션 취소 axios
        // 동적으로 수정
        // input 2개 받아오기 (미션, 멤버 이름, 이유)

        alert('[000]님의 [미션 1. 알고리즘] 완료 인증이 취소되었습니다 !');
        setMissionCancelModalSwitch(false);
    };

    return (
        <div>
            <Modal
                className="modal-style"
                overlayClassName="overlay"
                isOpen={missionCancelModalSwitch}
                onRequestClose={() => setMissionCancelModalSwitch(false)}
                ariaHideApp={false}
            >
                <div onClick={closeModalHandler}>
                    <img
                        className="modal-mission-add-close-icon"
                        src="/asset/icons/close.svg"
                        alt="close-icon"
                    />
                </div>
                <div className="modal-mission-cancel-content">
                    <div className="title5 modal-cancel-header">
                        <div className="modal-cancel-title-container">
                            <div className="title3">
                                미션 완료를 취소합니다.
                            </div>
                            <div className="title5 cancel-modal-description">
                                멤버가 잘못된 인증을 했을 경우, 미션완료를
                                취소합니다.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mission-cancel-modal-mission-list">
                            {groupMissions.map((mission: any) => {
                                return (
                                    <div key={mission.id}>
                                        <label
                                            onClick={() =>
                                                missionTypeHandler(mission.id)
                                            }
                                            style={{
                                                backgroundColor:
                                                    selectedMissionId ===
                                                    mission.id
                                                        ? '#94897c'
                                                        : '#acacac',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="missionType"
                                            />
                                            <div>
                                                미션 {mission.id}.{' '}
                                                {mission.mTitle}
                                            </div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        <ModalMemberList
                            action="미션인증 취소"
                            missionCancelDone={missionCancelDone}
                            closeModalHandler={closeModalHandler}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
