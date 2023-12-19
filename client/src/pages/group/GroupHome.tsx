import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { useDispatch, useSelector } from 'react-redux';
// import { changeGroup } from '../../store/slices/groupSlice';

import '../../styles/scss/components/titles.scss';
import '../../styles/scss/components/buttons.scss';
import '../../styles/scss/pages/group/groupHome.scss';

import HomeMissionList from '../../components/group/home/HomeMissionList';
import CurRanking from '../../components/group/home/CurRanking';
import AccRanking from '../../components/group/home/AccRanking';
import MemberList from '../../components/group/home/MemberList';

import { GroupDetailType, RootStateType } from '../../../src/types/types'; // Redux 스토어 전체 타입을 가져옵니다.

export default function GroupHome({ socket }: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    //-- redux test 용
    // const dispatch = useDispatch();

    // const dummyGroupState = useSelector(
    //     (state: RootStateType) => state.dummyGroup
    // );

    // const userState = useSelector((state: RootStateType) => state.user);

    // == 프로필 사진 가져오기 ==
    const [userImgSrc, setUserImgSrc] = useState<any>('/asset/images/user.svg'); // 문자열 변수
    console.log('userImgSrc', userImgSrc); //null : 프로필 사진 등록 안 했을 때

    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('getUserData 로그인 후 ', res.data);
                const { userImg } = res.data; //null

                if (userImg !== null && userImg !== undefined) {
                    // user가 업로드한 값이 있을 때
                    setUserImgSrc(userImg);
                    console.log('userImgSrc 있음', userImgSrc);
                } else {
                    // user가 업로드한 값이 없거나 undefined일 때
                    setUserImgSrc('/asset/images/user.svg');
                    console.log('userImgSrc 없음', userImgSrc);
                }
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        if (cookie.get('isUser')) {
            getUserData();
        } else {
            return;
        }
    }, []);

    //=== 모임 상세화면 읽어오기 ===

    const { gSeq } = useParams();

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
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setGroupDetail(res.data);

                setNowRanking(res.data.nowScoreUserInfo);
                setNowScoreRanking(res.data.doneRates);

                setTotalRanking(res.data.totalScoreUserInfo);
                setTotalScoreRanking(res.data.totalRanking);

                setIsLeader(res.data.isLeader);
                setIsJoin(res.data.isJoin);

                switch (res.data.groupCategory) {
                    case 'ex':
                        setGCategory('운동');
                        break;
                    case 're':
                        setGCategory('독서');
                        break;
                    case 'lan':
                        setGCategory('언어');
                        break;
                    case 'cert':
                        setGCategory('자격증');
                        break;
                    case 'st':
                        setGCategory('스터디');
                        break;
                    case 'eco':
                        setGCategory('경제');
                        break;
                    case 'it':
                        setGCategory('IT');
                        break;
                    case 'etc':
                        setGCategory('기타');
                        break;
                }
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    //] 모임 가입하기
    const postGroupJoin = async () => {
        const input = { gSeq };
        const res = await axios
            .post(`${process.env.REACT_APP_DB_HOST}/group/join`, input, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                const { success, msg } = res.data;

                if (!success) {
                    toast.error(msg, {
                        duration: 2000,
                    });
                } else {
                    toast.success(msg, {
                        duration: 2000,
                    });

                    setJoinSuccess(true);
                    window.location.reload();
                }
            });
    };

    //] 가입 성공 시, 채팅방 입장
    const [joinSuccess, setJoinSuccess] = useState(false);

    useEffect(() => {
        if (joinSuccess) {
            console.log('joinRoom gSeq :::::', gSeq);
            console.log('joinRoom에 전송할 데이터 >>>', {
                gSeq: Number(gSeq),
                isSignup: 'true',
            });

            socket?.emit('joinRoom', {
                gSeq: gSeq,
                isSignup: 'true',
            });

            // 서버에서 보낸 data
            socket?.on('loginNotice', (data: any) => {
                console.log('joinRoom event received on client', data);
            }); // {msg: '테스트1님이 모임에 참여하셨어요!'}
        }
    }, [joinSuccess]);

    const [gCategory, setGCategory] = useState('');

    // 모임장 / 멤버
    const [isLeader, setIsLeader] = useState(false);
    const [isJoin, setIsJoin] = useState(false);

    // 현재 점수 리스트
    const [nowScoreRanking, setNowScoreRanking] = useState([]);

    // 현재 랭킹 유저 정보
    const [nowScoreUserInfo, setNowScoreUserInfo] = useState([]);

    // 유저별 점수
    const [nowRanking, setNowRanking] = useState([]);

    const [uSeqList, setUSeqList] = useState<any>([]);
    const [uNameList, setUNameList] = useState<any>([]);
    const [uImgList, setUImgList] = useState<any>([]);

    // 누적 랭킹
    const [totalRanking, setTotalRanking] = useState([]);
    const [totalScoreRanking, setTotalScoreRanking] = useState([]);

    const [missionList, setMissionList] = useState<any>(
        groupDetail.groupMission
    );
    useEffect(() => {
        setMissionList(groupDetail.groupMission);
    }, [groupDetail.groupMission]);
    console.log('missionList GROUP', missionList);

    console.log('groupDetail HOME', groupDetail);

    return (
        <div className="section group-home">
            {/* [추후] 모임생성 시, 이미지 파일 없으므로 삼항연산자로 처리 */}

            {groupDetail.groupCoverImg ? (
                // [추후] 커버이미지 추가
                <div className="cover-img">
                    <div className="title1 cover-title">
                        {groupDetail.groupName}
                    </div>
                </div>
            ) : (
                <div className="title3" style={{ padding: '2rem' }}>
                    {groupDetail.groupName}
                </div>
            )}

            <div className="wrapper">
                <div className="group-title-wrapper">
                    <div className="title5 group-title-text">
                        어떤 모임인가요 ?
                    </div>
                    <div className="group-category-label">{gCategory}</div>
                </div>
                <div className="main-content">{groupDetail.grInformation}</div>
            </div>

            <HomeMissionList
                missionList={missionList}
                setMissionList={setMissionList}
                gDday={groupDetail.groupDday}
                isLeader={isLeader}
                groupDetail={groupDetail}
            />

            <div className="ranking-container">
                <CurRanking
                    nowScoreUserInfo={nowScoreUserInfo}
                    nowRanking={nowRanking}
                    groupMember={groupDetail.groupMember}
                    nowScoreRanking={nowScoreRanking}
                    userImgSrc={userImgSrc}
                />
                <AccRanking
                    totalRanking={totalRanking}
                    totalScoreRanking={totalScoreRanking}
                    userImgSrc={userImgSrc}
                />
            </div>

            <MemberList
                gMax={groupDetail.groupMaxMember}
                isLeader={groupDetail.isLeader}
                groupMember={groupDetail.memberArray}
                leaderInfo={groupDetail.leaderInfo}
                memberArray={groupDetail.memberArray}
            />

            {isJoin ? (
                ''
            ) : groupDetail.groupMaxMember !== null &&
              groupDetail.memberArray.length + 1 <
                  groupDetail.groupMaxMember ? (
                <div className="btn-fixed-wrapper">
                    <button className="btn-fixed" onClick={postGroupJoin}>
                        가입하기
                    </button>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}
