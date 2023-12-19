import React, { useEffect, useState } from 'react';

import { Link, useParams, useNavigate } from 'react-router-dom';

import Modal from 'react-modal';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import '../../../styles/scss/components/modal.scss';
import { GroupMissionsType } from 'src/types/types';
import toast, { Toaster } from 'react-hot-toast';

export default function WarningModal({
    warningModalSwitch,
    setWarningModalSwitch,
    action,
    gbSeq,
    mSeq,
    socket,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser'); // 토큰 값

    const { gSeq } = useParams();

    const [groupName, setGroupName] = useState<GroupMissionsType[]>([]);

    console.log('warningModal socket >>>', socket);

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setGroupName(res.data.groupName);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    const nvg = useNavigate();

    const logoutHandler = () => {
        cookie.remove('isUser');
        cookie.remove('token');
        nvg('/');
        window.location.reload();
    };

    const [leaveGroupSuccess, setLeaveGroupSuccess] = useState(false);

    //=== 모달창 '확인' 버튼 클릭 시 ===
    const doneHandler = () => {
        if (action === '회원 탈퇴') {
            alert(`Motimate ${action}하셨습니다 !`);
            // 회원 탈퇴
            axios
                .delete(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    logoutHandler();
                });
        } else if (action === '모임 삭제') {
            const deleteGroupHandler = async () => {
                const res = await axios
                    .delete(`${process.env.REACT_APP_DB_HOST}/group`, {
                        data: { gSeq },
                        headers: {
                            Authorization: `Bearer ${uToken}`,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        // toast.success(
                        //     `${groupName} 모임을 ${action}하셨습니다.`
                        // );
                        nvg('/group');
                    });
            };
            deleteGroupHandler();
        } else if (action === '모임 탈퇴') {
            const quitGroupHandler = async () => {
                const res = await axios
                    .delete(
                        `${process.env.REACT_APP_DB_HOST}/group/quit/${gSeq}`,
                        {
                            headers: {
                                Authorization: `Bearer ${uToken}`,
                            },
                        }
                    )
                    .then((res) => {
                        console.log(res.data);

                        //++ 모임 채팅 OUT
                        setLeaveGroupSuccess(true);

                        // [TEST]용 주석 처리
                        // nvg('/group');
                    });
            };
            quitGroupHandler();
        } else if (action === '게시글을 삭제') {
            const boardDeleteHandler = async (gbSeq: number) => {
                const res = await axios
                    .delete(
                        `${process.env.REACT_APP_DB_HOST}/board/delete/${gbSeq}`,
                        {
                            headers: {
                                Authorization: `Bearer ${uToken}`,
                            },
                        }
                    )
                    .then((res) => {
                        console.log(res.data);
                        toast.success(`${action}하셨습니다.`, {
                            duration: 2000,
                        });
                        nvg(-1);
                    });
            };
            boardDeleteHandler(gbSeq);
        }
    };

    //++ 모임 채팅 OUT
    useEffect(() => {
        if (leaveGroupSuccess) {
            console.log('모임 탈퇴 시 roomOut에 전송할 데이터 >>>', {
                gSeq: Number(gSeq),
            });

            socket?.emit('roomOut', {
                gSeq: Number(gSeq),
            });

            // 서버에서 보낸 data
            socket?.on('msg', (data: any) => {
                console.log('roomOut event received on client', data);
            });
        }
    }, [leaveGroupSuccess]);

    //] 모달창 닫기
    const closeModalHandler = () => {
        setWarningModalSwitch(false);
    };

    return (
        <div className="modal-mission-add-container">
            <Modal
                className="warning-modal-style"
                overlayClassName="overlay"
                isOpen={warningModalSwitch}
                onRequestClose={() => setWarningModalSwitch(false)}
                ariaHideApp={false}
            >
                <div onClick={closeModalHandler}>
                    <img
                        className="modal-mission-add-close-icon"
                        src="/asset/icons/close.svg"
                        alt="close-icon"
                    />
                </div>
                <div className="modal-mission-cancel-content leave-modal-content">
                    <div className="modal-cancel-title-container leave-modal-container">
                        <div className="title1">🚨</div>
                        <div className="title3">
                            {action === '삭제'
                                ? `게시글을 ${action}하시겠습니까 ?`
                                : action === '탈퇴'
                                ? `${groupName}  모임을 정말 ${action}하시겠습니까 ?`
                                : action === '회원 탈퇴'
                                ? `정말 ${action}하시겠습니까 ?`
                                : `정말 ${action}하시겠습니까 ?`}
                        </div>

                        {action === '회원 탈퇴' ? (
                            <div className="title5 cancel-modal-description">
                                Motimate 활동 정보가 모두 사라지며 복구되지
                                않습니다.
                            </div>
                        ) : action === '게시글을 삭제' ? (
                            <div className="title5 cancel-modal-description">
                                게시글 내용이 모두 사라지며 복구되지 않습니다.{' '}
                            </div>
                        ) : action === '댓글 삭제' ? (
                            ''
                        ) : action === '회원 탈퇴' || '탈퇴' ? (
                            <div className="title5 cancel-modal-description">
                                모임의 활동 정보가 모두 사라지며 복구되지
                                않습니다.
                            </div>
                        ) : (
                            ''
                        )}
                    </div>

                    <div className="mission-cancel-btn-container">
                        <button
                            onClick={doneHandler}
                            className="btn-md mission-cancel-done-btn"
                        >
                            {action === '게시글을 삭제' ? '삭제' : action}
                        </button>
                        <button
                            onClick={closeModalHandler}
                            className="btn-md mission-cancel-back-btn"
                        >
                            취 소
                        </button>
                    </div>
                </div>
                <Toaster />
            </Modal>
        </div>
    );
}
