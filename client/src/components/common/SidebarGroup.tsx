import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import { GroupMissionsType } from 'src/types/types';
import SideBarGroupLeader from './SidebarGroupLeader';
import SideBarGroupMember from './SidebarGroupMember';

import '../../styles/scss/layout/sidebarGroup.scss';

export default function SideBarGroup({
    isShrinkView,
    setIsShrinkView,
    socket,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq, mSeq } = useParams();

    const [groupMissions, setGroupMissions] = useState<GroupMissionsType[]>([]);
    const [groupName, setGroupName] = useState<GroupMissionsType[]>([]);

    useEffect(() => {
        const getGroup = async () => {
            const res = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            setGroupMissions(res.data.groupMission);
            setGroupName(res.data.groupName);

            setIsLeader(res.data.isLeader);
            setIsJoin(res.data.isJoin);

            setLeaderName(res.data.leaderInfo.uName);
        };

        getGroup();
    }, []);

    //-- 모임장 / 멤버
    const [isLeader, setIsLeader] = useState(false);
    const [isJoin, setIsJoin] = useState(false);
    const [leaderName, setLeaderName] = useState('');

    // console.log('leaderName', leaderName);
    // console.log('groupMissions', groupMissions);

    let mSeqList = [];

    for (let i = 1; i <= groupMissions.length; i++) {
        mSeqList.push(i);
    }

    // 메뉴 선택
    const [menu, setMenu] = useState('');

    // 경고 공통 모달
    const [warningModalSwitch, setWarningModalSwitch] = useState(false);

    const warningModalSwitchHandler = (menu: string) => {
        setMenu(menu);
        setWarningModalSwitch(!warningModalSwitch);
    };

    // const [isShrinkView, setIsShrinkView] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [menuBar, setMenuBar] = React.useState(false);

    const handleSidebarView = () => {
        setIsShrinkView(!isShrinkView);
    };

    const handleThemeChange = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark');
    };

    const openToggleHandler = () => {
        setIsOpen(!setIsOpen);
    };

    const menuBarTrue = () => {
        setMenuBar(true);
    };

    return (
        <div className="sidebar-all">
            {/* <div
                style={{
                    height: '230px',
                    zIndex: '0',
                }}
            ></div> */}
            {isJoin ? (
                <div
                    className={`sidebar-container${
                        isShrinkView ? ' shrink' : ''
                    }`}
                    style={{ width: '100%' }}
                    // style={
                    //     //     isLeader
                    //     //         ? isShrinkView
                    //     //             ? {
                    //     //                   //   marginTop: '-17.2rem',
                    //     //               }
                    //     //             : {
                    //     //                   //   marginTop: '-30rem',
                    //     //               }
                    //     //         : isShrinkView
                    //     //         ? {
                    //     //               marginTop: '-28.1rem',
                    //     //           }
                    //     //         : {
                    //     //               marginTop: '-21rem',
                    //     //           }
                    // }
                >
                    <button
                        className="sidebar-viewButton"
                        type="button"
                        aria-label={
                            isShrinkView ? 'Expand Sidebar' : 'Shrink Sidebar'
                        }
                        title={isShrinkView ? 'Expand' : 'Shrink'}
                        onClick={handleSidebarView}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-chevron-left"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div className="sidebar-wrapper">
                        <div
                            className="sidebar-themeContainer"
                            style={
                                isLeader
                                    ? { backgroundColor: '#f5e060' }
                                    : { backgroundColor: '#ffc8cd' }
                                // : { backgroundColor: '#ffe3e6' }  // 연한 핑크
                            }
                        >
                            {isLeader ? (
                                // LEADER
                                <div
                                    className="sidebar-profileSection"
                                    style={{ backgroundColor: '#f5e060' }}
                                >
                                    <img
                                        src="/asset/images/leader.gif"
                                        width="40"
                                        height="40"
                                        alt="profile"
                                    />
                                    <div className="profile-text-wrapper">
                                        <span style={{ fontWeight: 'bold' }}>
                                            LEADER
                                        </span>
                                        <br />
                                        <span>{leaderName}</span>
                                    </div>
                                </div>
                            ) : (
                                // MEMBER
                                <div
                                    className="sidebar-profileSection"
                                    style={{
                                        backgroundColor: '#ffc8cd',
                                        // backgroundColor: '#ffe3e6', // 연한 핑크
                                        // padding: '0 1rem',
                                    }}
                                >
                                    <img
                                        src="/asset/images/member.gif"
                                        width="40"
                                        height="40"
                                        alt="profile"
                                    />
                                    <div className="profile-text-wrapper">
                                        <span style={{ fontWeight: 'bold' }}>
                                            MEMBER
                                        </span>
                                        <br />
                                        <span>{leaderName}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <ul className="sidebar-list">
                            <li className="sidebar-listItem home-menu-containar">
                                <Link to={`/group/home/${gSeq}`}>
                                    <svg
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        height="1.5em"
                                        width="1.5em"
                                        className="party-icon"
                                    >
                                        <path d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z" />
                                        <path d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z" />
                                    </svg>
                                    <span className="sidebar-listItemText">
                                        Home
                                    </span>
                                </Link>
                            </li>

                            <li className="sidebar-listItem secondary-menu">
                                <span
                                    className="sidebar-listItemText sub-menu-title"
                                    style={{ color: '#9f9f9f' }}
                                >
                                    Board
                                </span>
                                <div
                                    className="sidebar-list-menu-wrapper"
                                    onClick={menuBarTrue}
                                >
                                    <Link to={`/board/${gSeq}/notice`}>
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
                                            <rect
                                                x="3"
                                                y="4"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            />
                                            <line
                                                x1="16"
                                                y1="2"
                                                x2="16"
                                                y2="6"
                                            />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line
                                                x1="3"
                                                y1="10"
                                                x2="21"
                                                y2="10"
                                            />
                                        </svg>

                                        <span className="sidebar-listItemText">
                                            공지사항
                                        </span>
                                    </Link>
                                </div>
                            </li>

                            <li className="sidebar-listItem">
                                <Link to={`/board/${gSeq}/free`}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="sidebar-listIcon"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            rx="2"
                                            ry="2"
                                            className="sidebar-listIcon"
                                        />
                                        <path d="M3 9h18M9 21V9" />
                                    </svg>
                                    <span className="sidebar-listItemText">
                                        자유 / 질문
                                    </span>
                                </Link>
                            </li>
                            <div className="empty-li"></div>

                            <li className="sidebar-listItem secondary-menu">
                                <span
                                    className="sidebar-listItemText sub-menu-title"
                                    style={{ color: '#9f9f9f' }}
                                >
                                    Mission
                                </span>
                                <div className="drop-down-menu-box">
                                    <a
                                        className="drop-down-menu-container"
                                        onClick={openToggleHandler}
                                    >
                                        <div className="drop-down-menu-title">
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
                                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                            </svg>
                                            <span className="sidebar-listItemText">
                                                진행
                                            </span>
                                        </div>
                                        <svg
                                            viewBox="0 0 866 1000"
                                            fill="currentColor"
                                            height="1em"
                                            width="1em"
                                            className="open-icon"
                                        >
                                            <path d="M63 280l370 356 372-356c14.667-17.333 30.667-17.333 48 0 17.333 14.667 17.333 30.667 0 48L457 720c-14.667 14.667-30.667 14.667-48 0L13 328c-17.333-17.333-17.333-33.333 0-48 16-16 32.667-16 50 0" />
                                        </svg>
                                    </a>

                                    <ul className="progress-mission">
                                        {groupMissions.map(
                                            (mission: any, idx: number) => {
                                                return (
                                                    <li
                                                        key={idx}
                                                        className="mission-active-list"
                                                        // style={{
                                                        //     fontWeight: 'bold',
                                                        // }}
                                                    >
                                                        <Link
                                                            to={`/board/${gSeq}/mission/${mission.mSeq}`}
                                                        >
                                                            <div
                                                                key={idx}
                                                                className=""
                                                            >
                                                                {mission.mTitle}
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                            </li>

                            <li className="sidebar-listItem">
                                <Link to={`/board/${gSeq}/mission/done`}>
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
                                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                                    </svg>
                                    <span className="sidebar-listItemText">
                                        완료
                                    </span>
                                </Link>
                            </li>

                            {/* <li className="sidebar-listItem active">
                            <a>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="sidebar-listIcon"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        rx="2"
                                        ry="2"
                                        className="sidebar-listIcon"
                                    />
                                    <path d="M3 9h18M9 21V9" />
                                </svg>
                                <span className="sidebar-listItemText">
                                    Dashboard
                                </span>
                            </a>
                        </li> */}

                            {/* LEADER / MEMBER 메뉴 */}

                            {isLeader ? (
                                <SideBarGroupLeader
                                    warningModalSwitch={warningModalSwitch}
                                    setWarningModalSwitch={
                                        setWarningModalSwitch
                                    }
                                    warningModalSwitchHandler={
                                        warningModalSwitchHandler
                                    }
                                    menu={menu}
                                    setMenu={setMenu}
                                />
                            ) : (
                                <SideBarGroupMember
                                    warningModalSwitch={warningModalSwitch}
                                    setWarningModalSwitch={
                                        setWarningModalSwitch
                                    }
                                    warningModalSwitchHandler={
                                        warningModalSwitchHandler
                                    }
                                    menu={menu}
                                    setMenu={setMenu}
                                    socket={socket}
                                />
                            )}
                        </ul>
                    </div>
                </div>
            ) : (
                <div></div>
            )}

            {/* 모바일 고려해야 함 !!!!!! */}
            {/* {isJoin ? (
                <div className="sidebar-container">
                    <div className="dropdown">
                        <button
                            style={{ borderRadius: '0', fontWeight: 'bold' }}
                            className="dropbtn"
                        >
                            그룹 메뉴 보기
                        </button>
                        <div className="sidebar-content dropdown dropdown-content">
                            <div className="sidebar-list">
                                <div className="sidebar-theme-list"> */}
            {/* <div className="theme-flex">
                                        <div
                                            className="theme-title"
                                            style={{ fontWeight: 'bold' }}
                                        >
                                            <Link to={`/group/home/${gSeq}`}>
                                                홈으로 가기
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="theme-flex">
                                        <div className="theme-title">
                                            게시판
                                        </div>
                                        <div className="board-content">
                                            <Link to={`/board/${gSeq}/notice`}>
                                                <div
                                                    className="sidebar-theme"
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    공지사항
                                                </div>
                                            </Link>
                                            <Link to={`/board/${gSeq}/free`}>
                                                <div
                                                    className="sidebar-theme"
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    자유
                                                </div>
                                            </Link>
                                        </div>
                                    </div> */}
            {/* <div className="theme-flex">
                                        <div className="theme-title">미션</div>
                                        <div className="mission-res">
                                            <div className="mission-flex">
                                                <div className="mission-title">
                                                    진행 중
                                                </div>
                                                <div>
                                                    <ul className="progress-mission">
                                                        {groupMissions.map(
                                                            (
                                                                mission: any,
                                                                idx: number
                                                            ) => {
                                                                return (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="sidebar-theme"
                                                                        style={{
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        <Link
                                                                            to={`/board/${gSeq}/mission/${mission.mSeq}`}
                                                                        >
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className=""
                                                                            >
                                                                                {
                                                                                    mission.mTitle
                                                                                }
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/board/${gSeq}/mission/done`}
                                            >
                                                <div className="mission-title">
                                                    완료
                                                </div>
                                            </Link>
                                        </div>
                                    </div> */}

            {/* <div className="empty-side-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            {/* ) : (
                <div></div>
            )} */}
        </div>
    );
}
