import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import SidebarChat from '../SidebarChat';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Item from '@mui/material/ListItem';

import SideBarGroup from '../SidebarGroup';
import Footer from '../Footer';

import '../../../styles/scss/layout/layout.scss';
import { useParams } from 'react-router-dom';

// groupbar section chat
export default function GroupLayout({ children, showChat }: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq } = useParams();

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

            setIsLeader(res.data.isLeader);
            setIsJoin(res.data.isJoin);
        };

        getGroup();
    }, []);

    //-- 모임장 / 멤버
    const [isLeader, setIsLeader] = useState(false);
    const [isJoin, setIsJoin] = useState(false);

    const [isShrinkView, setIsShrinkView] = React.useState(false);

    return (
        <>
            {/* 전체 레이아웃 컨테이너 */}
            <div className="layout-container">
                <Grid container>
                    <>
                        {/* 그룹 메뉴 바 컴포넌트 들어갈 곳 */}
                        <Grid md={2} sm={12} xs={12} className="groupMenu-div">
                            <Item
                                className="item-sidebar-box-list"
                                style={
                                    isJoin
                                        ? isLeader
                                            ? isShrinkView
                                                ? {
                                                      backgroundColor:
                                                          '#f5e060',
                                                      width: '50%',
                                                  }
                                                : {
                                                      backgroundColor:
                                                          '#f5e060',
                                                      width: '100%',
                                                  }
                                            : isShrinkView
                                            ? {
                                                  width: '50%',
                                                  backgroundColor: '#ffc8cd',
                                              }
                                            : {
                                                  width: '100%',
                                                  backgroundColor: '#ffc8cd',
                                              }
                                        : {
                                              width: '100%',
                                              backgroundColor: '#e0e0e0',
                                          }
                                }
                            >
                                <SideBarGroup
                                    isShrinkView={isShrinkView}
                                    setIsShrinkView={setIsShrinkView}
                                />
                            </Item>
                        </Grid>

                        <Grid
                            md={8}
                            sm={12}
                            xs={12}
                            className="section-wrapper"
                        >
                            {' '}
                            <Item
                                style={{
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingTop: '5rem',
                                }}
                            >
                                {children}
                            </Item>
                        </Grid>

                        {/* 채팅 컴포넌트 들어갈 곳 */}
                        <Grid md={2} sm={0} xs={0} className="chatting-div">
                            <Item
                                style={{
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingTop: 0,
                                }}
                            >
                                {showChat ? <SidebarChat /> : null}
                            </Item>
                        </Grid>
                        <div className="footer-layout-wrapper">
                            <div className="fence"></div>

                            <Footer />
                        </div>
                    </>
                </Grid>
            </div>
        </>
    );
}
