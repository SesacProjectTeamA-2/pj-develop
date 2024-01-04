//=== 모임장 그룹 사이드바 ===

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';

import { CopyToClipboard } from 'react-copy-to-clipboard';
// import toast from 'react-hot-toast';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

import '../../styles/scss/layout/sidebarGroup.scss';

import MissionCancelModal from './modal/MissionCancelModal';
import ChoiceModal from './modal/ChoiceModal';
import WarningModal from './modal/WarningModal';

export default function SideBarGroupLeader({
    warningModalSwitch,
    setWarningModalSwitch,
    warningModalSwitchHandler,
    menu,
    setMenu,
    setKey,
    leftMember,
    memberArray,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq } = useParams();

    const [missionCancelModalSwitch, setMissionCancelModalSwitch] =
        useState(false);

    const [inviteCode, setInviteCode] = useState('');

    // 멤버 선택하는 공통 모달
    const [choiceModalSwitch, setChoiceModalSwitch] = useState(false);

    const choiceModalSwitchHandler = (menu: string) => {
        setMenu(menu);
        setChoiceModalSwitch(!choiceModalSwitch);
    };

    const missionCancelModalHandler = () => {
        setMissionCancelModalSwitch(true);
    };

    // 초대하기 링크
    const onClickInviteButton = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/group/getJoinLink/${gSeq}`
            );

            if (response.data.success) {
                // API로부터 gLink를 받아서 inviteCode에 설정
                setInviteCode(response.data.gLink);
                // console.log('inviteCode:', inviteCode); // 이 줄을 추가
            } else {
                // 에러 메시지 처리
                toast.error('초대코드를 가져오는 데 실패했습니다.', {
                    duration: 2000,
                });
            }
        } catch (error) {
            // API 호출 중 오류 처리
            console.error('Error while fetching invite link:', error);
        }
    };

    //; 모임 삭제 (DELETE)
    const tryDeleteGroupHandler = (gSeq: number) => {
        warningModalSwitchHandler('모임 삭제');
    };

    return (
        <>
            <Toaster />

            <li className="sidebar-listItem secondary-menu">
                <span className="sidebar-listItemText sub-menu-title">
                    Menu
                </span>
                <div className="drop-down-menu-box">
                    <a className="drop-down-menu-container">
                        <CopyToClipboard
                            text={inviteCode}
                            onCopy={() =>
                                toast.success(' 초대코드가 복사되었습니다 !', {
                                    duration: 2000,
                                })
                            }
                        >
                            <div className="drop-down-menu-title">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1.5em"
                                    width="1.5em"
                                    className="party-icon"
                                >
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10H2l2.929-2.929A9.969 9.969 0 012 12zm4.828 8H12a8 8 0 10-8-8c0 2.152.851 4.165 2.343 5.657l1.414 1.414-.929.929zM8 13h8a4 4 0 11-8 0z" />
                                </svg>

                                <span className="sidebar-listItemText">
                                    초대
                                </span>
                            </div>
                            {/* <svg
                                        viewBox="0 0 866 1000"
                                        fill="currentColor"
                                        height="1em"
                                        width="1em"
                                        className="open-icon"
                                    >
                                        <path d="M63 280l370 356 372-356c14.667-17.333 30.667-17.333 48 0 17.333 14.667 17.333 30.667 0 48L457 720c-14.667 14.667-30.667 14.667-48 0L13 328c-17.333-17.333-17.333-33.333 0-48 16-16 32.667-16 50 0" />
                                    </svg> */}
                        </CopyToClipboard>
                    </a>
                </div>
            </li>

            <li className="sidebar-listItem">
                <a
                    onClick={() =>
                        choiceModalSwitchHandler('모임장 권한 넘기기')
                    }
                    // className="leader-warning"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        height="1.5em"
                        width="1.5em"
                        className="change-icon"
                    >
                        <path d="M21.71 9.29l-4-4a1 1 0 00-1.42 1.42L18.59 9H7a1 1 0 000 2h14a1 1 0 00.92-.62 1 1 0 00-.21-1.09zM17 13H3a1 1 0 00-.92.62 1 1 0 00.21 1.09l4 4a1 1 0 001.42 0 1 1 0 000-1.42L5.41 15H17a1 1 0 000-2z" />
                    </svg>
                    <span className="sidebar-listItemText">권한 위임</span>
                </a>
            </li>

            <li className="sidebar-listItem">
                <a onClick={() => choiceModalSwitchHandler('신고')}>
                    <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        height="1.5em"
                        width="1.5em"
                        className="change-icon"
                    >
                        <path
                            fillRule="evenodd"
                            d="M1.75 1.5a.25.25 0 00-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h6.5a.25.25 0 00.25-.25v-9.5a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0114.25 13H8.06l-2.573 2.573A1.457 1.457 0 013 14.543V13H1.75A1.75 1.75 0 010 11.25v-9.5zM9 9a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"
                        />
                    </svg>

                    <span className="sidebar-listItemText">신고</span>
                </a>
            </li>

            {/* [추후] */}
            {/* <li
                    onClick={missionCancelModalHandler}
                    className="title5 leader-warning"
                >
                    미션완료 취소
                </li> */}

            {/* [추후] */}
            {/* <li
                    onClick={() => choiceModalSwitchHandler('강제 퇴장')}
                    className="title5 leader-warning"
                    style={{ cursor: 'pointer' }}
                >
                    강제 퇴장시키기
                </li> */}

            <li className="sidebar-listItem">
                {/* <a> */}
                <Link to={`/group/edit/${gSeq}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="sidebar-listIcon"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                    <span className="sidebar-listItemText">설정</span>
                </Link>
                {/* </a> */}
            </li>

            <li className="sidebar-listItem">
                <a
                    onClick={() => tryDeleteGroupHandler(Number(gSeq))}
                    // className="title5 leader-warning"
                >
                    <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        height="1.5em"
                        width="1.5em"
                        className="party-icon"
                    >
                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                    </svg>
                    <span className="sidebar-listItemText a">삭제</span>
                </a>
            </li>

            {missionCancelModalSwitch ? (
                <MissionCancelModal
                    missionCancelModalSwitch={missionCancelModalSwitch}
                    setMissionCancelModalSwitch={setMissionCancelModalSwitch}
                />
            ) : null}

            {/* 멤버 선택하는 공통 모달 */}
            <ChoiceModal
                choiceModalSwitch={choiceModalSwitch}
                setChoiceModalSwitch={setChoiceModalSwitch}
                choiceModalSwitchHandler={choiceModalSwitchHandler}
                action={menu}
                setKey={setKey}
            />

            {/* 경고 공통 모달 */}
            <WarningModal
                warningModalSwitch={warningModalSwitch}
                setWarningModalSwitch={setWarningModalSwitch}
                warningModalSwitchHandler={warningModalSwitchHandler}
                action={menu}
                leftMember={leftMember}
                memberArray={memberArray}
            />
        </>
    );
}
