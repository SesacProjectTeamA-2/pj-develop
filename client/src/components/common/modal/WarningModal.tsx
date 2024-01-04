import React, { useEffect, useState } from 'react';

import { Link, useParams, useNavigate } from 'react-router-dom';

import Modal from 'react-modal';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import '../../../styles/scss/components/modal.scss';
import { GroupMissionsType } from 'src/types/types';
import toast, { Toaster } from 'react-hot-toast';
import ChoiceModal from './ChoiceModal';

export default function WarningModal({
    warningModalSwitch,
    setWarningModalSwitch,
    action,
    gbSeq,
    mSeq,
    socket,
    setKey,
    selectedUSeq, // 관리자가 삭제하려는 uSeq List
    selectedGSeq, // 관리자가 삭제하려는 gSeq List
    leftMember, // 2명그룹 : 모임장이 모임 삭제할 경우 자동 위임되는 --> .uSeq: "남아있는 한 명의 uSeq" (숫자 하나만 보냄)
    memberArray, // 3명이상그룹 : 모임장이 모임 삭제할 경우 위임창 뜨게
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser'); // 토큰 값

    const { gSeq } = useParams();

    const [groupName, setGroupName] = useState<GroupMissionsType[]>([]);

    // console.log('warningModal socket >>>', socket);

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

    //] 멤버 선택하는 공통 모달
    const [choiceModalSwitch, setChoiceModalSwitch] = useState(false);

    const choiceModalSwitchHandler = () => {
        setChoiceModalSwitch(!choiceModalSwitch);
    };

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
            //-- 남은 인원 1명이 있을 경우 : 마찬가지 ?
            //-- 0명일 경우
            const deleteGroupHandler = async () => {
                const res = await axios
                    .delete(`${process.env.REACT_APP_DB_HOST}/group`, {
                        data: {
                            gSeq: Number(gSeq),
                            newLeaderUSeq: leftMember?.uSeq,
                        },
                        headers: {
                            Authorization: `Bearer ${uToken}`,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        toast.success(
                            `${groupName} 모임을 ${action}하셨습니다.`
                        );
                        //-- 남은 인원 0명 : 모임 완전 삭제
                        alert(`${groupName} 모임을 삭제하셨습니다.`);
                        nvg('/group');

                        //_ [참고] 위임 모달창 (choiceModal)에서 위임 후 삭제 처리하도록 수정했습니다.
                        // //-- 남은 인원 2명 이상 : 위임 모달창
                        // if (memberArray?.length >= 2) {
                        //     // console.log('modal 떠라...!', memberArray?.length);
                        //     setWarningModalSwitch(false); // 모임 삭제 모달창 닫기
                        //     return choiceModalSwitchHandler(); // 위임 모달창 실행
                        // if (memberArray?.length === 1) {
                        //-- 남은 인원 1명 : 자동 위임
                        // nvg('/group');
                        // } else nvg('/group');
                    });
            };
            deleteGroupHandler();
        } else if (action === '모임 위임 후 삭제') {
            //-- 남은 인원 2명 이상 : 위임 모달창
            setWarningModalSwitch(false); // 모임 삭제 모달창 닫기
            choiceModalSwitchHandler(); // 위임 모달창 실행
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

                        //++ 모임 채팅방 OUT
                        setLeaveGroupSuccess(true);

                        //++ 미확인 채팅 메세지 데이터 지우기
                        // 로컬스토리지 삭제
                        localStorage.removeItem(`gSeq${gSeq}`);

                        nvg('/group');
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
        } else if (action === '관리자 유저 삭제') {
            const adminDeleteUserHandler = async () => {
                // selected uSeq 배열 반복
                for (const uSeq of selectedUSeq) {
                    try {
                        // 각 uSeq에 대한 삭제 요청
                        const res = await axios.delete(
                            `${process.env.REACT_APP_DB_HOST}/admin/users/${uSeq}`
                        );
                        window.location.reload();
                        console.log(`deleteUser ${uSeq}`, res.data);
                    } catch (err) {
                        console.log(`error 발생 for uSeq ${uSeq}: `, err);
                    }
                }
            };
            adminDeleteUserHandler();
        } else if (action === '관리자 그룹 삭제') {
            const adminDeleteGroupHandler = async () => {
                // selected gSeq 배열 반복
                for (const gSeq of selectedGSeq) {
                    try {
                        // 각 gSeq에 대한 삭제 요청
                        const res = await axios.delete(
                            `${process.env.REACT_APP_DB_HOST}/admin/groups/${gSeq}`
                        );
                        window.location.reload();
                        console.log(`deleteUser ${gSeq}`, res.data);
                    } catch (err) {
                        console.log(`error 발생 for gSeq ${gSeq}: `, err);
                    }
                }
            };
            adminDeleteGroupHandler();
        } else if (action === '로그인 이동') {
            nvg('/login');
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

            // // 서버에서 보낸 data
            // socket?.on('msg', (data: any) => {
            //     console.log('roomOut event received on client', data);
            // });
        }
    }, [leaveGroupSuccess]);

    //] 모달창 닫기
    const closeModalHandler = () => {
        setWarningModalSwitch(false);
    };

    return (
        <>
            {/* 멤버 선택하는 공통 모달 */}
            <ChoiceModal
                choiceModalSwitch={choiceModalSwitch}
                setChoiceModalSwitch={setChoiceModalSwitch}
                choiceModalSwitchHandler={choiceModalSwitchHandler}
                action={'모임 위임 후 삭제'}
                setKey={setKey}
            />
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
                                    : action === '관리자 유저 삭제'
                                    ? `강제 퇴장시키겠습니까 ?`
                                    : action === '관리자 그룹 삭제'
                                    ? `그룹을 강제 삭제하겠습니까 ?`
                                    : action === '로그인 이동'
                                    ? `로그인이 필요한 서비스입니다.`
                                    : action === '모임 위임 후 삭제' // 남은 인원 2명이상
                                    ? `정말 ${groupName} 모임을 나가시겠습니까 ?`
                                    : action === '모임 자동위임' // 남은 인원 1명
                                    ? `${groupName} 모임을 나가시겠습니까 ?`
                                    : `정말 ${action}하시겠습니까 ?`}
                            </div>

                            {action === '회원 탈퇴' ? (
                                <div className="title5 cancel-modal-description">
                                    Motimate 활동 정보가 모두 사라지며 복구되지
                                    않습니다.
                                </div>
                            ) : action === '게시글을 삭제' ? (
                                <div className="title5 cancel-modal-description">
                                    게시글 내용이 모두 사라지며 복구되지
                                    않습니다.{' '}
                                </div>
                            ) : action === '댓글 삭제' ? (
                                ''
                            ) : action === '관리자 유저 삭제' ? (
                                <div className="title5 cancel-modal-description">
                                    관리자 권한으로{' '}
                                    {selectedUSeq.map(
                                        (userUSeq: number, index: number) => (
                                            <span
                                                key={userUSeq}
                                                style={{
                                                    color: '#d01e1e',
                                                    display: 'inline',
                                                }}
                                            >
                                                {index > 0 && ', '}
                                                {`${userUSeq}번`}
                                            </span>
                                        )
                                    )}{' '}
                                    회원을 강제 퇴장시킵니다. <br />
                                </div>
                            ) : action === '관리자 그룹 삭제' ? (
                                <div className="title5 cancel-modal-description">
                                    관리자 권한으로{' '}
                                    {selectedGSeq.map(
                                        (userGSeq: number, index: number) => (
                                            <span
                                                key={userGSeq}
                                                style={{
                                                    color: '#d01e1e',
                                                    display: 'inline',
                                                }}
                                            >
                                                {index > 0 && ', '}
                                                {`${userGSeq}번`}
                                            </span>
                                        )
                                    )}{' '}
                                    그룹을 강제 삭제합니다. <br />
                                    <div style={{ color: '#9a9a9a' }}>
                                        모임의 활동 정보가 모두 사라지며
                                        복구되지 않습니다.
                                    </div>{' '}
                                </div>
                            ) : action === '로그인 이동' ? (
                                <div className="title5 cancel-modal-description">
                                    로그인 페이지로 이동하시겠습니까?
                                </div>
                            ) : action === '모임 위임 후 삭제' ? ( // 남은 인원 2명 이상
                                <div className="title5 cancel-modal-description">
                                    모임의 활동 정보가 모두 사라지며 복구되지
                                    않습니다.
                                </div>
                            ) : action === '모임 자동위임' ? ( // 남은 인원 1명
                                <div
                                    className="title5 cancel-modal-description"
                                    style={{ textAlign: 'center' }}
                                >
                                    <span
                                        style={{
                                            color: 'gray',
                                            display: 'inline',
                                        }}
                                    >
                                        {leftMember?.uName}
                                    </span>
                                    &nbsp;님에게 모임장 권한 위임 후, <br />
                                    모임의 활동 정보가 모두 사라지며 복구되지
                                    않습니다.
                                </div>
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
                            {action === '로그인 이동' ? (
                                <button
                                    onClick={doneHandler}
                                    className="btn-md move-to-login-btn"
                                >
                                    로그인 이동
                                </button>
                            ) : (
                                <button
                                    onClick={doneHandler}
                                    className="btn-md mission-cancel-done-btn"
                                    // style={action === '로그인 이동' ? buttonStyle : {}}
                                >
                                    {action === '게시글을 삭제'
                                        ? '삭 제'
                                        : action === '관리자 유저 삭제'
                                        ? '강제 퇴장'
                                        : action === '관리자 그룹 삭제'
                                        ? '강제 삭제'
                                        : action === '모임 위임 후 삭제'
                                        ? '모임 삭제'
                                        : action === '모임 자동위임'
                                        ? '탈 퇴'
                                        : action}
                                </button>
                            )}

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
        </>
    );
}
