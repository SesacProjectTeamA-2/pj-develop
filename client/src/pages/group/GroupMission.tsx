import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import '../../styles/scss/pages/group/groupMissionList.scss';

import GroupContent from '../../components/group/content/GroupContentList';
import GroupHeader from '../../components/group/content/GroupHeader';
import { GroupDetailType } from 'src/types/types';
import GroupMissionList from 'src/components/group/content/GroupMissionList';

export default function GroupMission() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq, mSeq, gCategory } = useParams();

    console.log('mSeq', mSeq);

    //=== 모임 상세화면 읽어오기 ===
    const getMissionBoard = async () => {
        const res = await axios
            .get(
                `${process.env.REACT_APP_DB_HOST}/board/${gSeq}/mission/${mSeq}`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                setMissionBoard(res.data.groupInfo);
            });
    };

    useEffect(() => {
        getMissionBoard();
    }, []);

    const [missionBoard, setMissionBoard] = useState();

    //=== 모임 상세화면 읽어오기 ===
    const [groupDetail, setGroupDetail] = useState<GroupDetailType>({
        grInformation: '',
        groupCategory: '',
        groupCoverImg: '',
        groupDday: 0,
        groupMaxMember: 0,
        groupMember: [],
        groupMission: [],
        groupName: '',
        isJoin: false,
        isLeader: false,
        nowScoreUserInfo: [],
        totalScoreUserInfo: [],
        result: false,
        leaderInfo: {
            uSeq: 0,
            uName: '',
            uImg: '',
            uCharImg: '',
        },
        memberArray: [],
    });

    const getGroup = async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`,
            {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            }
        );

        setGroupDetail(res.data);
        setMissionList(res.data.groupMission);

        // console.log('res.data.groupMission', res.data.groupMission);
    };

    useEffect(() => {
        getGroup();
    }, []);

    console.log(groupDetail);

    const [missionList, setMissionList] = useState<any>([]);

    let missionTitle = '';

    for (let mission of missionList) {
        if (mission.mSeq === Number(mSeq)) {
            missionTitle = mission.mTitle;
        }
    }

    let missionProof = '';

    for (let mission of missionList) {
        if (mission.mSeq === Number(mSeq)) {
            missionProof = mission.mContent;
        }
    }

    // let missionIdList = [];

    // for (let i = 0; i < missionList.length; i++) {
    //     missionIdList.push(missionList[i].mSeq);
    // }

    console.log('missionList=========', missionList);

    console.log('missionBoard', missionBoard);

    return (
        <div className="section section-group">
            <GroupHeader
                title={`미션 : ${missionTitle}`}
                groupName={groupDetail.groupName}
            />
            <div className="noti-container proof-container">
                <div className="noti-header proof-header">
                    <div className="title5">[ 인증방법 ]</div>
                    <div>{missionProof}</div>
                </div>
            </div>
            <GroupMissionList
                missionList={missionList}
                groupDetail={groupDetail}
                missionBoard={missionBoard}
            />

            <div className="plus-fixed-wrapper">
                <span className="plus-text">
                    미션 {missionTitle}
                    <br />
                    인증하기 !
                </span>
                <Link to={`/board/create/${gSeq}/mission/${mSeq}`}>
                    <img
                        src="/asset/icons/plus.svg"
                        className="plus-fixed"
                        alt="plus-fixed"
                    />
                </Link>
            </div>
        </div>
    );
}
