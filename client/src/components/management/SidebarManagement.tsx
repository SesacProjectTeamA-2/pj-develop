import React from 'react';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import '../../styles/scss/layout/sidebarGroup.scss';
import '../../styles/scss/pages/management/managementsidebar.scss';

export default function SidebarManagement() {
    return (
        <div className="sidebar-container" style={{ width: '100%' }}>
            <div
                className="sidebar-content"
                style={{ backgroundColor: '#615d58', color: 'white' }}
            >
                <ul className="sidebar-list">
                    <li className="sidebar-listItem home-menu-containar">
                        <Link to="/management">
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
                            <span className="sidebar-listItemText">Home</span>
                        </Link>
                    </li>

                    {/* <input type="radio" style={{ display: 'none' }} />
                            <span data-hover="회원 관리"> 회원 관리</span> */}

                    <li className="sidebar-listItem secondary-menu">
                        <span
                            className="sidebar-listItemText sub-menu-title"
                            style={{ color: '#9f9f9f' }}
                        >
                            Board
                        </span>
                        <div
                            className="sidebar-list-menu-wrapper"
                            // onClick={menuBarTrue}
                        >
                            {/* <Link to={`/board/${gSeq}/notice`}> */}
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
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>

                            <span className="sidebar-listItemText">
                                공지사항
                            </span>
                            {/* </Link> */}
                        </div>
                    </li>

                    <li className="sidebar-listItem home-menu-containar">
                        <Link to="/management/users">
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
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="sidebar-listItemText">
                                회원 관리
                            </span>
                        </Link>
                    </li>

                    <li className="sidebar-listItem home-menu-containar">
                        <Link to="/management/groups">
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
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="sidebar-listItemText">
                                그룹 관리
                            </span>
                        </Link>
                    </li>

                    <li className="sidebar-listItem home-menu-containar">
                        <Link to="/management/reports">
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
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="sidebar-listItemText">
                                신고 내역
                            </span>
                        </Link>
                    </li>
                </ul>

                {/* <ul className="menu align-center expanded text-center SMN_effect-42">
                    <Link to="/management/users">
                        <li className="">
                            <input type="radio" style={{ display: 'none' }} />
                            <span data-hover="회원 관리"> 회원 관리</span>
                        </li>
                    </Link>

                    <Link to="/management/groups">
                        <li className="">
                            <span data-hover="그룹 관리">그룹 관리</span>
                        </li>
                    </Link>

                    <Link to="/management/reports">
                        <li className="">
                            <span data-hover="신고 내역">신고 내역</span>
                        </li>
                    </Link>
                </ul> */}
            </div>
        </div>
    );
}
