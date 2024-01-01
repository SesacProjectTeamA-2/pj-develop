//=== 모달용 멤버 리스트 ===
// 모임장 제외, 멤버 한 명 선택 가능

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { Divider, TextField } from '@mui/material';
import { Box } from '@mui/system';

export default function ModalMemberList({
    action,
    missionCancelDone,
    closeModalHandler,
    setChoiceModalSwitch,
    setSelectedMemberId,
    selectedMemberId,
    setSelectedMemberName,
    selectedMemberName,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');
    const { gSeq } = useParams();

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
        } else {
            return;
        }
    }, []);

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setMemberArray(res.data.memberArray);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    const [memberArray, setMemberArray] = useState<any>([]);
    // id 추가
    for (let i = 0; i < memberArray?.length; i++) {
        memberArray.id = i;
    }

    const listClickHandler = (uSeq: number, uName: string) => {
        setSelectedMemberId(uSeq);
        setSelectedMemberName(uName);
    };

    return (
        <div className="modal-member-list-container">
            {/* 모임장 제외 멤버 리스트 */}
            {memberArray?.length > 0 ? (
                memberArray.map((member: any) => {
                    return (
                        <div>
                            <ul className="list-unstyled modal-member-list-ul">
                                <label
                                    key={member.uSeq}
                                    onClick={() =>
                                        listClickHandler(
                                            member.uSeq,
                                            member.uName
                                        )
                                    }
                                    className="modal-member-list-label"
                                    style={{
                                        backgroundColor:
                                            action === '신고' &&
                                            selectedMemberId === member.uSeq
                                                ? '#cc0101'
                                                : action === '강제 퇴장' &&
                                                  selectedMemberId ===
                                                      member.uSeq
                                                ? '#cc0101'
                                                : action === '미션인증 취소' &&
                                                  selectedMemberId ===
                                                      member.uSeq
                                                ? '#cc0101'
                                                : action ===
                                                      '모임장 권한 넘기기' &&
                                                  selectedMemberId ===
                                                      member.uSeq
                                                ? '#94897c'
                                                : 'white',

                                        color:
                                            selectedMemberId === member.uSeq
                                                ? 'white'
                                                : 'black',

                                        cursor: 'pointer',

                                        fontWeight: 'bold',
                                    }}
                                >
                                    <input
                                        className="mission-cancel-modal-memeber-input"
                                        type="radio"
                                        name="missionType"
                                    />
                                    <div className="ranking-list modal-member-list">
                                        <img
                                            src={
                                                member.uImg ||
                                                '/asset/images/user.svg'
                                            }
                                            alt="userImg"
                                            style={{
                                                // width: '40px',
                                                // height: '40px',
                                                width: '100%',
                                            }}
                                        />
                                        <div className="cur-ranking-content">
                                            <div className="title4 name">
                                                {member.uName}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                {/* <Divider /> */}
                            </ul>
                            <div>
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': {
                                            width: '67ch',
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    {/* <TextField
                                        id="filled-multiline-flexible"
                                        label="이유가 무엇인가요 ?"
                                        multiline
                                        maxRows={4}
                                        variant="filled"
                                    /> */}
                                </Box>
                            </div>

                            {/* <div className="mission-cancel-btn-container">
                                {action === '미션인증 취소' ? (
                                    <button
                                        onClick={missionCancelDone}
                                        className="btn-md mission-cancel-done-btn"
                                    >
                                        {action}
                                    </button>
                                ) : action === '모임장 권한 넘기기' ? (
                                    <button
                                        onClick={patchLeader}
                                        className="btn-md mission-cancel-done-btn"
                                    >
                                        {action}
                                    </button>
                                ) : action === '강제 퇴장' ? (
                                    <button
                                        onClick={missionCancelDone}
                                        className="btn-md mission-cancel-done-btn"
                                    >
                                        {action}
                                    </button>
                                ) : (
                                    ''
                                )}
                                <button
                                    onClick={closeModalHandler}
                                    className="btn-md mission-cancel-back-btn"
                                >
                                    취소
                                </button>
                            </div> */}
                        </div>
                    );
                })
            ) : (
                <>
                    <div
                        className="title2"
                        style={{
                            height: '14rem',
                            margin: 'auto',
                            // textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        멤버가 없습니다.
                    </div>
                    <div className="mission-cancel-btn-container">
                        <button
                            onClick={closeModalHandler}
                            className="btn-md mission-cancel-back-btn"
                        >
                            돌아가기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
