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
import GroupSearchAll from './pages/group/GroupSearchAll';

function App() {
    //] socket 전역으로 관리
    const [socket, setSocket] = useState<any>();

    //] 알람 sse 전역으로 관리
    const [sse, setSse] = useState<any>();
    console.log('sse 여부 [App] >>>>>>>', sse);
    console.log('socket 여부 [App] >>>>>>>', socket);

    const [showChat, setShowChat] = useState<boolean>(() => {
        // 로컬 스토리지에서 값을 읽어오기
        const storedShowChat = localStorage.getItem('showChat');
        return storedShowChat ? JSON.parse(storedShowChat) : false;
    });

    //-- Header 채팅 아이콘 클릭 시 실행하는 함수
    const showChatting = (): void => {
        //     setShowChat(!showChat); // 채팅 사이드바 유무
        setShowChat((prevShowChat) => {
            // 로컬 스토리지에 값을 저장하기
            localStorage.setItem('showChat', JSON.stringify(!prevShowChat));
            return !prevShowChat;
        });
    };

    const [isIntro, setIsIntro] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isJoinPage, setIsJoinPage] = useState<boolean>(false);
    const [initialLogin, setInitialLogin] = useState<any>(false);
    // admin 인증
    const [adminUser, setAdminUser] = useState(false);
    // key 상태 추가
    const [key, setKey] = useState(0); // 알람 설정 시, 리렌더링

    const [allGroupInfo, setAllGroupInfo] = useState<any>([]); // 모든 모임(리더+멤버) 관리
    // console.log('allGroupInfo APP >>>>', allGroupInfo);

    const [recentMsg, setRecentMsg] = useState<any>(); // 방 나갈 때, 최신 메세지
    const [isEnter, setIsEnter] = useState(false); // 입장/나가기
    const [loginUser, setLoginUser] = useState<any>([]); // joinRoom 이후 접속한 유저 리스트 업데이트

    //++ Header 채팅 아이콘 클릭 시, socket roomInfo 이벤트
    // 모임별 채팅 최신 정보 (최신 메세지, 안읽은 메세지)
    useEffect(() => {
        if (showChat) {
            socket?.emit('roomInfo', { isOut: '' });

            // 서버에서 보낸 data
            socket?.on('roomInfo', (data: any) => {
                console.log('roomInfo event received on client :::', data);

                // 시간 변환
                const formattedData = data?.map((msgObj: any) => ({
                    ...msgObj,
                    msg: {
                        ...msgObj.msg,
                        timeStamp: new Date(
                            msgObj.msg.timeStamp
                        ).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        }),
                    },
                }));

                setRecentMsg(formattedData);

                // console.log('formattedData', formattedData);
            }); // 최신 메세지, 안읽은 메세지 없으면 : [] 빈 배열
        }
    }, [showChat]);

    const [alarmCount, setAlarmCount] = useState(0);
    const [alarmList, setAlarmList] = useState<any>();
    const [commentAlarm, setCommentAlarm] = useState<any>();
    // console.log('alarmCount', alarmCount);
    // console.log('실시간 commentAlarm >>>>>>', commentAlarm);
    // console.log('업데이트 여부 alarmList >>>>>>', alarmList);

    return (
        <div className="App">
            <Header
                showChatting={showChatting}
                setShowChat={setShowChat}
                showChat={showChat}
                isIntro={isIntro}
                setIsIntro={setIsIntro}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                isJoinPage={isJoinPage}
                setIsJoinPage={setIsJoinPage}
                socket={socket}
                setSocket={setSocket}
                sse={sse}
                setSse={setSse}
                adminUser={adminUser}
                setAdminUser={setAdminUser}
                alarmCount={alarmCount}
                setAlarmCount={setAlarmCount}
                alarmList={alarmList}
                setAlarmList={setAlarmList}
                commentAlarm={commentAlarm}
                setRecentMsg={setRecentMsg} // 전역으로 실시간 최신 메세지 업데이트
                isEnter={isEnter} // 퇴장할 때마다, unreadMsg 업데이트
                // isEnter인 경우에는 미확인 채팅 메세지 +1 안함
                allGroupInfo={allGroupInfo}
                setAllGroupInfo={setAllGroupInfo}
                setKey={setKey}
                key={key}
                loginUser={loginUser}
                setLoginUser={setLoginUser}
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
                                    socket={socket}
                                    setSse={setSse}
                                    setAlarmCount={setAlarmCount}
                                    setAlarmList={setAlarmList}
                                    setCommentAlarm={setCommentAlarm}
                                    setKey={setKey}
                                    loginUser={loginUser}
                                    setLoginUser={setLoginUser}
                                />
                            }
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/group"
                    element={
                        <BasicLayout
                            children={<Groups />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/group/all"
                    element={
                        <BasicLayout
                            children={<GroupSearchAll />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/group/create"
                    element={
                        <BasicLayout
                            children={
                                <GroupCreate
                                    socket={socket}
                                    loginUser={loginUser}
                                    setLoginUser={setLoginUser}
                                />
                            }
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                {/* 그룹에만 그룹 메뉴 존재 */}
                <Route
                    path="/group/home/:gSeq"
                    element={
                        <GroupLayout
                            children={
                                <GroupHome
                                    socket={socket}
                                    key={key}
                                    setKey={setKey}
                                    loginUser={loginUser}
                                    setLoginUser={setLoginUser}
                                />
                            }
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/:gCategory"
                    element={
                        <GroupLayout
                            children={<GroupNoti />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/free"
                    element={
                        <GroupLayout
                            children={<GroupBoard />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/mission/:mSeq"
                    element={
                        <GroupLayout
                            children={<GroupMission />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />
                <Route
                    path="/board/:gSeq/mission/done"
                    element={
                        <GroupLayout
                            children={<GroupMissionDone />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/:gCategory/:gbSeq"
                    element={
                        <GroupLayout
                            children={<GroupPostDetail key={key} />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                <Route
                    path="/board/:gSeq/mission/:mSeq/:gbSeq"
                    element={
                        <GroupLayout
                            children={<GroupMissionDetail />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
                        />
                    }
                />

                {/* --- 그룹 라우팅 끝 --- */}

                <Route
                    path="/mypage"
                    element={
                        <BasicLayout
                            children={<MyPage socket={socket} />}
                            showChat={showChat}
                            showChatting={showChatting}
                            socket={socket}
                            recentMsg={recentMsg}
                            setRecentMsg={setRecentMsg}
                            isEnter={isEnter}
                            setIsEnter={setIsEnter}
                            allGroupInfo={allGroupInfo}
                            setAllGroupInfo={setAllGroupInfo}
                            setKey={setKey}
                            key={key}
                            loginUser={loginUser}
                            setLoginUser={setLoginUser}
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
                            showChatting={showChatting}
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
                            showChatting={showChatting}
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
                            showChatting={showChatting}
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
                            showChatting={showChatting}
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
