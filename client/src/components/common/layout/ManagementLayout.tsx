import React from 'react';
import SidebarChat from '../SidebarChat';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Item from '@mui/material/ListItem';

import SidebarManagement from '../../management/SidebarManagement';
import Footer from '../Footer';

// groupbar section chat
export default function ManagementLayout({ children, showChat }: any) {
    return (
        <>
            {/* 전체 레이아웃 컨테이너 */}
            <div className="layout-container">
                <Grid container>
                    {showChat ? (
                        // 채팅이 있을 경우
                        <>
                            {/* 그룹 메뉴 바 컴포넌트 들어갈 곳 */}
                            <Grid
                                md={2}
                                sm={12}
                                xs={12}
                                className="manageMenu-div "
                            >
                                <Item
                                    style={{
                                        backgroundColor: '#615d58',
                                        width: '100%',
                                        height: '100%',
                                        //     paddingLeft: 0,
                                        //     paddingRight: 0,
                                        paddingTop: '4rem',
                                        //     justifyContent: 'Center',
                                    }}
                                >
                                    <SidebarManagement />
                                </Item>
                            </Grid>
                            {/* 본문 */}
                            <Grid
                                md={8}
                                sm={12}
                                xs={12}
                                className="section-wrapper "
                            >
                                {' '}
                                <Item
                                    style={{
                                        padding: '7rem 3rem',
                                        // paddingLeft: 0,
                                        // paddingRight: 0,
                                        // paddingTop: 0,
                                        // justifyContent: 'Center',
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
                                        justifyContent: 'Center',
                                    }}
                                >
                                    <SidebarChat />
                                </Item>
                            </Grid>
                        </>
                    ) : (
                        // 채팅이 없을 경우
                        <>
                            <Grid
                                md={2}
                                sm={12}
                                xs={12}
                                className="manageMenu-div"
                            >
                                <Item
                                    style={{
                                        backgroundColor: '#615d58',
                                        width: '100%',
                                        height: '100%',
                                        //     paddingLeft: 0,
                                        //     paddingRight: 0,
                                        paddingTop: '4rem',
                                        //     justifyContent: 'Center',
                                    }}
                                >
                                    <SidebarManagement />{' '}
                                </Item>
                            </Grid>
                            <Grid
                                md={8}
                                sm={12}
                                xs={12}
                                className="section-wrapper"
                            >
                                <Item
                                    style={{
                                        padding: '7rem 3rem',
                                        // paddingLeft: 0,
                                        // paddingRight: 0,
                                        // paddingTop: 0,
                                        // justifyContent: 'Center',
                                    }}
                                >
                                    {' '}
                                    {children}
                                </Item>
                            </Grid>
                            <Grid
                                md={2}
                                sm={0}
                                xs={0}
                                className="chatting-div"
                            ></Grid>
                        </>
                    )}
                    <Footer />
                </Grid>
            </div>
        </>
    );
}
