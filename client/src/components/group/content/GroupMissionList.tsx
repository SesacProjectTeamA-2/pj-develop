import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import GroupContentFooter from './GroupContentFooter';

//=== 공통 컴포넌트 ===
//-- GroupMission.tsx
// action={"미션게시글"}

export default function GroupMissionList({
    action,
    missionList,
    groupDetail,
}: // missionBoard,
any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    // 0. 프로필 사진 가져오기
    const [userImgSrc, setUserImgSrc] = useState<any>('/asset/images/user.svg'); // 문자열 변수

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

                if (userImg !== null || userImg !== undefined) {
                    //user가 업로드한 값 없으면 기본 이미지
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
            console.log('HEADER 로그인');
        } else {
            console.log('HEADER 비로그인');
            return;
        }
    }, []);

    const { gSeq, mSeq, gCategory } = useParams();

    //] 2. 미션게시글
    const [missionBoard, setMissionBoard] = useState([]);

    // 미션 게시글 조회
    const getBoardMission = async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_DB_HOST}/board/${gSeq}/mission/${mSeq}`,
            {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            }
        );

        console.log('게시글 조회 ::::', res.data);

        setMissionBoard(res.data.groupInfo);
    };

    // console.log('missionList', missionList);
    // console.log('groupDetail', groupDetail);
    // console.log('missionBoard', missionBoard);

    useEffect(() => {
        getBoardMission();
    }, [mSeq]);

    return (
        <div className="noti-container post-list-container">
            <ul>
                {missionBoard?.length <= 0
                    ? '작성된 미션 인증글이 없습니다. '
                    : missionBoard
                          ?.reverse()
                          .map((mission: any, idx: number) => {
                              return (
                                  <Link
                                      to={`/board/${gSeq}/mission/${mSeq}/${mission.gbSeq}`}
                                      className="link-none"
                                  >
                                      {/* [ START ] */}
                                      <li>
                                          <div className="post-list-content">
                                              <div className="post-list-header">
                                                  <div className="post-list-title">
                                                      {/* 프로필 이미지 */}
                                                      <img
                                                          className="profile-img"
                                                          src={
                                                              mission
                                                                  .tb_groupUser
                                                                  .tb_user
                                                                  .uImg ||
                                                              '/asset/images/user.svg'
                                                          }
                                                          alt="profile"
                                                      />

                                                      <div
                                                          style={{
                                                              display: 'flex',
                                                              flexDirection:
                                                                  'column',
                                                          }}
                                                      >
                                                          <div
                                                              className="title4 cursor too-many-text"
                                                              dangerouslySetInnerHTML={{
                                                                  __html: mission.gbTitle,
                                                              }}
                                                              style={{
                                                                  width: '30vw',
                                                              }}
                                                          />
                                                          <div
                                                              style={{
                                                                  fontSize:
                                                                      '0.8rem',
                                                                  color: '#818181',
                                                              }}
                                                          >
                                                              {
                                                                  mission
                                                                      .tb_groupUser
                                                                      .tb_user
                                                                      .uName
                                                              }
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="post-list-date">
                                                      {mission.createdAt}
                                                  </div>
                                              </div>

                                              <div
                                                  className="post-list-main cursor"
                                                  dangerouslySetInnerHTML={{
                                                      __html: mission.gbContent,
                                                  }}
                                              />

                                              <GroupContentFooter
                                                  commentCount={
                                                      mission.commentCount
                                                  }
                                              />
                                          </div>
                                      </li>
                                      {/* [ END ] */}
                                  </Link>
                              );
                          })}
            </ul>
        </div>
    );
}
