import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Item from '@mui/material/ListItem';

import '../../../styles/scss/layout/layout.scss';
import '../../../styles/scss/layout/sidebarChat.scss';

import SidebarChat from '../SidebarChat';
import Footer from '../Footer';

export default function BasicLayout({
    children,
    showChat,
    setShowChat,
    socket,
}: any) {
    return (
        <>
            <div className="layout-container ">
                <Grid container>
                    <>
                        <Grid md={2} sm={0} xs={0} className="empty-div">
                            <Item
                                style={{
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingTop: 0,
                                }}
                            ></Item>
                        </Grid>

                        {/* 컨텐츠 컴포넌트 들어갈 곳 */}
                        <Grid
                            md={8}
                            sm={12}
                            xs={12}
                            className="section-wrapper"
                        >
                            <Item
                                style={{
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingTop: '4rem',
                                    justifyContent: 'center',
                                }}
                            >
                                {' '}
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
                                {showChat ? (
                                    <SidebarChat
                                        setShowChat={setShowChat}
                                        showChat={showChat}
                                        socket={socket}
                                    />
                                ) : null}
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
