import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import '../../styles/scss/pages/group/groupPostDetail.scss';
import { TextField } from '@mui/material';

import GroupHeader from '../../components/group/content/GroupHeader';
import GroupContentFooter from '../../components/group/content/GroupContentFooter';
import WarningModal from '../../components/common/modal/WarningModal';

export default function GroupPostDetail() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    // 0. 프로필 사진, 닉네임 가져오기
    const [userImgSrc, setUserImgSrc] = useState<any>('/asset/images/user.svg'); // 문자열 변수
    const [userNickname, setUserNickname] = useState<any>('');

    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('getUserData 로그인 후 ', res.data);
                const { userImg, nickname } = res.data; //null

                if (userImg !== null || userImg !== undefined) {
                    //user가 업로드한 값 없으면 기본 이미지
                    setUserImgSrc(userImg);
                    console.log('userImgSrc 있음', userImgSrc);
                } else {
                    // user가 업로드한 값이 없거나 undefined일 때
                    setUserImgSrc('/asset/images/user.svg');
                    console.log('userImgSrc 없음', userImgSrc);
                }
                setUserNickname(nickname);
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

    const { gSeq, mSeq, gbSeq, gCategory } = useParams();
    console.log(gSeq, mSeq, gbSeq, gCategory);

    //; 게시글 조회 (GET)
    const [freeList, setFreeList] = useState<any>([]);
    const [boardComments, setBoardComments] = useState<any>([]);

    const [userInfo, SetUserInfo] = useState<any>([]);
    const [boardUName, setBoardUName] = useState<any>('');

    //; 게시글 상세 조회 (공지/자유)
    const getBoardNoti = async () => {
        const res = await axios
            .get(
                `${process.env.REACT_APP_DB_HOST}/board/${gSeq}/${gCategory}/${gbSeq}`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                console.log('getBoardNoti=======', res.data);

                setFreeList(res.data.groupInfo);

                const userInfo = res.data.groupInfo.tb_groupUser.tb_user;
                SetUserInfo(userInfo);

                const boardComments = res.data.groupInfo.tb_groupBoardComments;
                setBoardComments(boardComments);

                setBoardUName(userInfo.uName);
            });
    };

    useEffect(() => {
        getBoardNoti();
    }, []);

    // 작성자인지 조회
    let isBoardWriter = false;
    if (userNickname === boardUName) {
        isBoardWriter = true;
    }

    console.log('boardComments', boardComments);

    //; 게시글 삭제 (DELETE)
    const boardDeleteHandler = () => {
        warningModalSwitchHandler();
    };

    // 경고 공통 모달
    const [warningModalSwitch, setWarningModalSwitch] = useState(false);

    const warningModalSwitchHandler = () => {
        setWarningModalSwitch(!warningModalSwitch);
    };

    //] 댓글
    // 댓글 리스트 : 자유게시글에 포함
    const [commentList, setCommentList] = useState<any>([]);

    const [commentInput, setCommentInput] = useState({
        gbSeq,
        gbcContent: '',
    });

    const commentOnChange = (e: any) => {
        setCommentInput({
            ...commentInput,
            gbcContent: e.target.value,
        });
    };

    //; 댓글 등록 (POST)
    const postCommentHandler = async () => {
        const res = await axios
            .post(
                `${process.env.REACT_APP_DB_HOST}/comment/create/${gbSeq}`,
                commentInput,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                console.log(res.data);

                getBoardNoti();

                setCommentInput({
                    ...commentInput,
                    gbcContent: '',
                });
            });
    };

    // === 수정 ===

    // 개별 관리
    const [commentEditInputs, setCommentEditInputs] = useState<string[]>([]);

    const commentEditOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        idx: number
    ) => {
        const updatedInputs = [...commentEditInputs];
        updatedInputs[idx] = e.target.value;
        setCommentEditInputs(updatedInputs);
    };

    // 댓글 수정 여부 id 관리 state
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null
    );

    //; 댓글 수정 (PATCH)
    const commentEditHandler = async (gbcSeq: number, idx: number) => {
        // console.log({ gbcSeq, gbcContent: commentEditInput.gbcContent });

        if (commentEditInputs[idx]?.length === 0) {
            alert('댓글을 입력해주세요 !');
            return;
        }

        const res = await axios
            .patch(
                `${process.env.REACT_APP_DB_HOST}/comment/edit/${gbcSeq}`,

                { gbcSeq, gbcContent: commentEditInputs[idx] },

                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                console.log(res.data);

                setEditingCommentId(null);

                getBoardNoti();
            });
    };

    //; 댓글 삭제 (DELETE)
    const commentDeleteHandler = async (gbcSeq: number) => {
        if (window.confirm('댓글을 삭제하시겠습니까 ?')) {
            const res = await axios
                .delete(
                    `${process.env.REACT_APP_DB_HOST}/comment/delete/${gbcSeq}`,

                    {
                        headers: {
                            Authorization: `Bearer ${uToken}`,
                        },
                    }
                )
                .then((res) => {
                    console.log(res.data);
                    setCommentList((prevComments: any) =>
                        prevComments.filter(
                            (comment: any) => comment.gbcSeq !== gbcSeq
                        )
                    );
                    getBoardNoti();
                });
        } else return;
    };

    return (
        <div className="section section-group">
            <div className="post-detail-container">
                <div className="post-detail-header-container">
                    <div className="post-detail-header">
                        <div className="post-detail-profile">
                            <img
                                className="profile-img"
                                src={userInfo?.uImg || '/asset/images/user.svg'}
                                alt="profile"
                            />

                            <div>
                                <div className="title4">
                                    {freeList.gbTitle}{' '}
                                </div>
                                <div>{userInfo?.uName}</div>
                            </div>
                        </div>
                        <div className="date">{freeList?.createdAt}</div>
                    </div>
                    <div className="writer-menu">
                        {isBoardWriter ? (
                            <div className="writer-menu-content">
                                <Link
                                    to={`/board/${gSeq}/edit/${gCategory}/${gbSeq}`}
                                    className="link-none"
                                >
                                    <div>수정</div>
                                </Link>
                                <div onClick={boardDeleteHandler}>삭제</div>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>

                {/* 경고 공통 모달 */}
                <WarningModal
                    warningModalSwitch={warningModalSwitch}
                    setWarningModalSwitch={setWarningModalSwitch}
                    warningModalSwitchHandler={warningModalSwitchHandler}
                    action={'게시글을 삭제'}
                    gbSeq={gbSeq}
                    mSeq={mSeq}
                />

                <div className="post-detail-content-container">
                    <div
                        className="post-detail-content"
                        dangerouslySetInnerHTML={{
                            __html: freeList?.gbContent,
                        }}
                    />

                    {/* 댓글 수, 반응 수 */}
                    <GroupContentFooter
                        commentCount={
                            boardComments.length <= 0 ? 0 : boardComments.length
                        }
                    />

                    <div className="comment-create">
                        <textarea
                            className="comment-textarea"
                            onChange={commentOnChange}
                            value={commentInput.gbcContent}
                        ></textarea>
                        <button
                            className="btn-md done-btn"
                            onClick={() => postCommentHandler()}
                        >
                            등록
                        </button>
                    </div>

                    <div className="comment-list">
                        <ul>
                            {boardComments.length <= 0
                                ? ''
                                : boardComments.map(
                                      (comment: any, idx: number) => {
                                          const isWriter =
                                              comment.tb_groupUser.tb_user
                                                  .uName === userNickname;

                                          const isEditing =
                                              editingCommentId ===
                                              comment.gbcSeq;
                                          return (
                                              <li key={idx}>
                                                  {/* START */}
                                                  <div className="comment-header">
                                                      <div className="comment-profile">
                                                          <img
                                                              className="comment-img"
                                                              src={
                                                                  comment
                                                                      .tb_groupUser
                                                                      .tb_user
                                                                      .uImg ||
                                                                  '/asset/images/user.svg'
                                                              }
                                                              alt="profile"
                                                          />
                                                          <div className="title5">
                                                              {
                                                                  comment
                                                                      .tb_groupUser
                                                                      .tb_user
                                                                      .uName
                                                              }
                                                          </div>
                                                      </div>
                                                      <div>
                                                          <div className="date">
                                                              {
                                                                  comment.createdAt
                                                              }
                                                          </div>

                                                          {/* 댓글 div */}
                                                          <div>
                                                              <div className="comment-header">
                                                                  {/* Comment content */}
                                                                  <div>
                                                                      {isWriter && (
                                                                          <div className="writer-menu">
                                                                              <div
                                                                                  style={{
                                                                                      padding:
                                                                                          '0.6rem',
                                                                                  }}
                                                                                  onClick={() => {
                                                                                      if (
                                                                                          isEditing
                                                                                      ) {
                                                                                          commentEditHandler(
                                                                                              comment.gbcSeq,
                                                                                              idx
                                                                                          );
                                                                                      } else {
                                                                                          setEditingCommentId(
                                                                                              comment.gbcSeq
                                                                                          );
                                                                                      }
                                                                                  }}
                                                                                  //   className=" cmt-edit-btn"
                                                                              >
                                                                                  {isEditing
                                                                                      ? '수정 완료'
                                                                                      : '수정'}
                                                                              </div>
                                                                              <div
                                                                                  style={{
                                                                                      padding:
                                                                                          '0.6rem',
                                                                                  }}
                                                                                  onClick={() =>
                                                                                      commentDeleteHandler(
                                                                                          comment.gbcSeq
                                                                                      )
                                                                                  }
                                                                                  //   className="cmt-del-btn"
                                                                              >
                                                                                  삭제
                                                                              </div>
                                                                          </div>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  {isEditing ? (
                                                      <TextField
                                                          value={
                                                              commentEditInputs[
                                                                  idx
                                                              ]
                                                          }
                                                          defaultValue={
                                                              comment.gbcContent
                                                          }
                                                          onChange={(e) =>
                                                              commentEditOnChange(
                                                                  e,
                                                                  idx
                                                              )
                                                          }
                                                          onKeyDown={(
                                                              e: React.KeyboardEvent<HTMLInputElement>
                                                          ) => {
                                                              if (
                                                                  e.key ===
                                                                      'Enter' &&
                                                                  !e.nativeEvent
                                                                      .isComposing
                                                              ) {
                                                                  commentEditHandler(
                                                                      comment.gbcSeq,
                                                                      idx
                                                                  );
                                                              }
                                                          }}
                                                      />
                                                  ) : (
                                                      <div>
                                                          {comment.gbcContent}
                                                      </div>
                                                  )}
                                              </li>
                                              //  END
                                          );
                                      }
                                  )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
