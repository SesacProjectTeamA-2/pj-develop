import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import GroupContentFooter from './GroupContentFooter';

//=== 공통 컴포넌트 ===
//-- 1. GroupBoard.tsx
// action={"자유게시글"}

//-- 2. GroupMission.tsx
// action={"미션게시글"}

export default function GroupContent({ action }: any) {
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
                // console.log('getUserData 로그인 후 ', res.data);
                const { userImg } = res.data; //null

                if (userImg !== null || userImg !== undefined) {
                    //user가 업로드한 값 없으면 기본 이미지
                    setUserImgSrc(userImg);
                    // console.log('userImgSrc 있음', userImgSrc);
                } else {
                    // user가 업로드한 값이 없거나 undefined일 때
                    setUserImgSrc('/asset/images/user.svg');
                    // console.log('userImgSrc 없음', userImgSrc);
                }
                // else if (userImg) {
                //     setUserImgSrc('/asset/images/user.svg');
                //     console.log('userImgSrc 없음', userImgSrc);
                // } else {
                //     console.log('암것도 아님', userImgSrc);
                // }
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };
    // console.log(window.location.pathname);

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

    // console.log(' gSeq, mSeq, gCategory', gSeq, mSeq, gCategory);

    //] 1. 자유게시글
    const [freeList, setFreeList] = useState<any>([]);
    const [commentCount, setCommentCount] = useState(0);

    // 자유 게시글 조회
    const getBoardFree = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/board/${gSeq}/free`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('게시글 조회 ::::', res.data);

                setFreeList(res.data.groupInfo);
            });

        // setCommentCount(res.data.groupInfo);
    };

    useEffect(() => {
        getBoardFree();
    }, []);

    // console.log('---------', freeList);
    // console.log('>>>>>>>>>>', commentCount);

    // //] 2. 미션게시글
    const [missionList, setMissionList] = useState([]);

    // 미션 게시글 조회
    if (mSeq) {
        const getBoardMission = async () => {
            const res = await axios.get(
                `${process.env.REACT_APP_DB_HOST}/board/${gSeq}/mission/${mSeq}`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            setMissionList(res.data.groupInfo);
        };
        getBoardMission();
    }
    useEffect(() => {}, []);

    return (
        <div className="noti-container post-list-container">
            <ul>
                <>
                    {/* 1. 자유게시글 */}

                    {freeList?.length <= 0
                        ? '작성된 게시물이 없습니다.'
                        : freeList?.map((free: any, idx: number) => {
                              return (
                                  <li key={idx}>
                                      {/* [ START ] */}
                                      <Link
                                          to={`/board/${gSeq}/free/${free.gbSeq}`}
                                          className="link-none"
                                      >
                                          <div className="post-list-content">
                                              <div className="post-list-header">
                                                  <div className="post-list-title">
                                                      <img
                                                          className="profile-img"
                                                          src={
                                                              free.tb_groupUser
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
                                                              className="title4 cursor"
                                                              dangerouslySetInnerHTML={{
                                                                  __html: free.gbTitle,
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
                                                                  free
                                                                      .tb_groupUser
                                                                      .tb_user
                                                                      .uName
                                                              }
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div
                                                      className="post-list-date"
                                                      style={{
                                                          fontSize: '0.8rem',
                                                          color: '#a1a1a1',
                                                      }}
                                                  >
                                                      {free.createdAt}
                                                  </div>
                                              </div>
                                              <div
                                                  className="post-list-main cursor"
                                                  dangerouslySetInnerHTML={{
                                                      __html: free.gbContent,
                                                  }}
                                              />

                                              <GroupContentFooter
                                                  commentCount={
                                                      free.commentCount
                                                  }
                                              />
                                          </div>
                                      </Link>
                                      {/* [ END ] */}
                                  </li>
                              );
                          })}
                </>
            </ul>
        </div>
    );
}
