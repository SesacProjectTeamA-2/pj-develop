import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import './styles/scss/base/reset.scss';

import Header from './components/common/Header';
import Intro from './pages/Intro';
import Main from './pages/Main';
import MyPage from './pages/user/MyPage';
import NotFound from './pages/NotFound';
import Management from './pages/Management';
import Login from './pages/user/Login';
import Join from './pages/user/Join';
import Groups from './pages/group/Groups';
import GroupHome from './pages/group/GroupHome';
import GroupNoti from './pages/group/GroupNoti';
import GroupBoard from './pages/group/GroupBoard';
import GroupMission from './pages/group/GroupMission';
import GroupMissionDone from './pages/group/GroupMissionDone';
import GroupCreate from './pages/group/GroupCreate';

import BasicLayout from './components/common/layout/BasicLayout';
import GroupLayout from './components/common/layout/GroupLayout';
import BoardPost from './pages/group/BoardPost';
import GroupPostDetail from './pages/group/GroupPostDetail';
import GroupEdit from './pages/group/GroupEdit';
import ManagementLayout from './components/common/layout/ManagementLayout';
import AllUser from './components/management/AllUser';
import AllGroup from './components/management/AllGroup';
import Report from './components/management/Report';
import BoardEdit from './pages/group/BoardEdit';
import GroupMissionDetail from './pages/group/GroupMissionDetail';
import MissionPost from './pages/group/MissionPost';
import BoardMissionEdit from './pages/group/BoardMissionEdit';

function App() {
    // 채팅
    const [showChat, setShowChat] = useState<boolean>(false);
    const showChatting = (): void => {
        setShowChat(!showChat);
    };

    const [isIntro, setIsIntro] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isJoinPage, setIsJoinPage] = useState<boolean>(false);
    const [initialLogin, setInitialLogin] = useState<any>(false);

    const [socket, setSocket] = useState<any>();

    // admin 인증
    const [adminUser, setAdminUser] = useState(false);

    return (
        <div className="App">
            <Header
                showChatting={showChatting}
                showChat={showChat}
                isIntro={isIntro}
                setIsIntro={setIsIntro}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                isJoinPage={isJoinPage}
                setIsJoinPage={setIsJoinPage}
                socket={socket}
                setSocket={setSocket}
                adminUser={adminUser}
                setAdminUser={setAdminUser}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Intro isIntro={isIntro} setIsIntro={setIsIntro} />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Login
                            setIsLogin={setIsLogin}
                            isLogin={isLogin}
                            setAdminUser={setAdminUser}
                        />
                    }
                />

                <Route
                    path="/join"
                    element={
                        <Join
                            isJoinPage={isJoinPage}
                            setIsJoinPage={setIsJoinPage}
                        />
                    }
                />

                <Route
                    path="/main"
                    element={
                        <BasicLayout
                            children={
                                <Main
                                    initialLogin={initialLogin}
                                    setInitialLogin={setInitialLogin}
                                    setSocket={setSocket}
                                />
                            }
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route
                    path="/group"
                    element={
                        <BasicLayout
                            children={<Groups />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />
                <Route
                    path="/group/create"
                    element={
                        <BasicLayout
                            children={<GroupCreate socket={socket} />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 그룹에만 그룹 메뉴 존재 */}
                <Route
                    path="/group/home/:gSeq"
                    element={
                        <GroupLayout
                            children={<GroupHome />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/:gCategory"
                    element={
                        <GroupLayout
                            children={<GroupNoti />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/free"
                    element={
                        <GroupLayout
                            children={<GroupBoard />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/mission/:mSeq"
                    element={
                        <GroupLayout
                            children={<GroupMission />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />
                <Route
                    path="/board/:gSeq/mission/done"
                    element={
                        <GroupLayout
                            children={<GroupMissionDone />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 게시물 Create - 공지, 자유 */}
                <Route
                    path="/board/create/:gSeq/:gCategory"
                    // path="*/post"
                    element={
                        <GroupLayout
                            children={<BoardPost />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 게시물 Create - 미션 */}
                <Route
                    path="/board/create/:gSeq/mission/:mSeq"
                    // path="*/post"
                    element={
                        <GroupLayout
                            children={<MissionPost />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 게시물 세부사항 Read */}

                <Route
                    path="/board/:gSeq/:gCategory"
                    element={
                        <GroupLayout
                            children={<BoardPost />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/:gCategory/:gbSeq"
                    element={
                        <GroupLayout
                            children={<GroupPostDetail />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/mission/:mSeq/:gbSeq"
                    element={
                        <GroupLayout
                            children={<GroupMissionDetail />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 게시물 Edit */}
                <Route
                    path="/board/:gSeq/edit/:gCategory/:gbSeq"
                    element={
                        <GroupLayout
                            children={<BoardEdit />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 게시물 Edit */}
                <Route
                    path="/board/:gSeq/edit/mission/:mSeq/:gbSeq"
                    element={
                        <GroupLayout
                            children={<BoardMissionEdit />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 모임 Edit */}
                <Route
                    path="/group/edit/:gSeq"
                    element={
                        <GroupLayout
                            children={<GroupEdit />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* --- 그룹 라우팅 끝 --- */}

                <Route
                    path="/mypage"
                    element={
                        <BasicLayout
                            children={<MyPage />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                {/* 관리자 */}
                <Route
                    path="/management"
                    element={
                        <ManagementLayout
                            children={<Management />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />
                <Route
                    path="/management/users"
                    element={
                        <ManagementLayout
                            children={<AllUser />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />
                <Route
                    path="/management/groups"
                    element={
                        <ManagementLayout
                            children={<AllGroup />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />
                <Route
                    path="/management/reports"
                    element={
                        <ManagementLayout
                            children={<Report />}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                        />
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
