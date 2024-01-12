import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import '../../styles/scss/pages/group/groupPostDetail.scss';
import { TextField } from '@mui/material';

import GroupHeader from '../../components/group/content/GroupHeader';
import GroupContentFooter from '../../components/group/content/GroupContentFooter';
import WarningModal from '../../components/common/modal/WarningModal';

export default function GroupMissionDetail() {
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

    const { gSeq, mSeq, gbSeq } = useParams();

    const [userInfo, SetUserInfo] = useState<any>([]);

    //==== 미션 게시글 조회 (GET) ====
    const [missionList, setMissionList] = useState<any>([]);
    const [boardUName, setBoardUName] = useState<any>('');

    // 미션 게시글 조회
    const getBoardMission = async () => {
        const res = await axios
            .get(
                `${process.env.REACT_APP_DB_HOST}/board/${gSeq}/mission/${mSeq}/${gbSeq}`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                console.log('GroupMissionDetail========', res.data);
                setMissionList(res.data.groupInfo);
                const userInfo = res.data.groupInfo.tb_groupUser.tb_user;
                SetUserInfo(userInfo);

                setCommentList(res.data.groupInfo.tb_groupBoardComments);

                setBoardUName(userInfo.uName);
            });
    };

    useEffect(() => {
        getBoardMission();
    }, []);

    // 작성자인지 조회
    let isBoardWriter = false;
    if (userNickname === boardUName) {
        isBoardWriter = true;
    }

    //; 게시글 삭제 (DELETE)
    const boardDeleteHandler = () => {
        warningModalSwitchHandler();
    };

    // 메뉴 선택
    const [menu, setMenu] = useState('');

    // 경고 공통 모달
    const [warningModalSwitch, setWarningModalSwitch] = useState(false);

    const warningModalSwitchHandler = () => {
        setWarningModalSwitch(!warningModalSwitch);
    };

    //=== 댓글 가져오기 (GET) ===
    const [commentList, setCommentList] = useState<any>([]);
    console.log('commentList', commentList);

    const [commentInput, setCommentInput] = useState({
        gbSeq,
        gbcContent: '',
        gSeq: Number(gSeq),
    });

    const commentOnChange = (e: any) => {
        setCommentInput({
            ...commentInput,
            gbcContent: e.target.value,
        });
    };

    //; 댓글 등록 (POST)
    const postCommentHandler = async () => {
        const res = await axios.post(
            `${process.env.REACT_APP_DB_HOST}/comment/create/${gbSeq}`,
            commentInput,
            {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            }
        );

        console.log(res.data);

        getBoardMission();

        setCommentInput({
            ...commentInput,
            gbcContent: '',
        });
    };

    const [commentEditInput, setCommentEditInput] = useState({
        gbcSeq: 1,
        gbcContent: '',
    });

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
        console.log({ gbcSeq, gbcContent: commentEditInput.gbcContent });

        if (commentEditInputs[idx]?.length === 0) {
            alert('댓글을 입력해주세요 !');
            return;
        }

        const res = await axios.patch(
            `${process.env.REACT_APP_DB_HOST}/comment/edit/${gbcSeq}`,

            { gbcSeq, gbcContent: commentEditInputs[idx] },
            // commentEditInput,

            {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            }
        );

        setEditingCommentId(null);

        getBoardMission();
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
                    getBoardMission();
                });
        } else return;
    };

    return (
        <div className="section section-group">
            {/* <GroupHeader
                // [ 추후 ] 넘버링 id 추가
                // title={`미션 1. ${missionArr[0]}`}
                title={`${gCategory}`}
                groupName={''}
            /> */}

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
                                    {missionList?.gbTitle}
                                </div>
                                <div>
                                    {missionList?.tb_groupUser?.tb_user.uName}
                                </div>
                            </div>
                        </div>
                        <div className="date">{missionList?.createdAt}</div>
                    </div>
                    <div className="writer-menu">
                        {isBoardWriter ? (
                            <div className="writer-menu-content">
                                <Link
                                    to={`/board/${gSeq}/edit/mission/${mSeq}/${gbSeq}`}
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
                />

                <div className="post-detail-content-container">
                    <div
                        className="post-detail-content"
                        dangerouslySetInnerHTML={{
                            __html: missionList?.gbContent,
                        }}
                    />

                    {/* 댓글 수, 반응 수 */}
                    <GroupContentFooter
                        commentCount={
                            missionList?.tb_groupBoardComments?.length <= 0
                                ? 0
                                : missionList?.tb_groupBoardComments?.length
                        }
                    />

                    <div className="comment-create">
                        <textarea
                            className="comment-textarea"
                            onChange={commentOnChange}
                            value={commentInput?.gbcContent}
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
                            {commentList?.map((comment: any, idx: number) => {
                                // 사용자 == 작성자 여부 구분
                                const isWriter =
                                    comment.tb_groupUser.tb_user.uName ===
                                    userNickname;
                                const isEditing =
                                    editingCommentId === comment.gbcSeq;
                                return (
                                    <li key={idx}>
                                        {/* START */}
                                        <div className="comment-header">
                                            <div className="comment-profile">
                                                <img
                                                    className="comment-img"
                                                    src={
                                                        comment.tb_groupUser
                                                            .tb_user.uImg ||
                                                        '/asset/images/user.svg'
                                                    }
                                                    alt="profile"
                                                />
                                                <div className="title5">
                                                    {
                                                        comment.tb_groupUser
                                                            .tb_user.uName
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <div className="date">
                                                    {comment.createdAt}
                                                </div>
                                                <div>
                                                    {/* 수정 삭제 버튼 div */}

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'row',
                                                            justifyContent:
                                                                'center',
                                                            flexBasis: '30%',
                                                        }}
                                                    >
                                                        {isWriter ? (
                                                            // 사용자 === 작성자
                                                            <div className="writer-menu">
                                                                {/* <div
                                                                    onClick={() =>
                                                                        commentEditHandler(
                                                                            comment.gbcSeq,
                                                                            idx
                                                                        )
                                                                    }
                                                                    // className="writer-menu"
                                                                >
                                                                    수정
                                                                </div> */}
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
                                                                    // className="cmt-del-btn"
                                                                >
                                                                    삭제
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <TextField
                                                value={commentEditInputs[idx]}
                                                defaultValue={
                                                    comment.gbcContent
                                                }
                                                onChange={(e) =>
                                                    commentEditOnChange(e, idx)
                                                }
                                                onKeyDown={(
                                                    e: React.KeyboardEvent<HTMLInputElement>
                                                ) => {
                                                    // Correct typing for the event
                                                    if (
                                                        e.key === 'Enter' &&
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
                                            <div>{comment.gbcContent}</div>
                                        )}

                                        {/* END */}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
