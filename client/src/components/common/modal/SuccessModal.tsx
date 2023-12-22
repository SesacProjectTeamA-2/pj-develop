import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { Cookies } from 'react-cookie';
import axios from 'axios';

import Modal from 'react-modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import '../../../styles/scss/components/modal.scss';

export default function SuccessModal({
    successModalSwitch,
    setSuccessModalSwitch,
    action,
    groupName,
    gSeq,
    mSeq,
    gCategory,
    gbSeq,
}: // choiceModalSwitchHandler,
any) {
    //=== 성공 모달창 ===
    // 1. 모임 생성
    // 2. 모임 수정 완료
    // 3. 마이페이지 수정 완료
    // 4. 게시글 작성 완료
    // 5. 모임장 위임 완료
    // 6. 회원가입 완료

    const nvg = useNavigate();

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const doneHandler = () => {
        alert(`${action}했습니다 !`);

        // [추후] 강제퇴장 멘트 작성

        setSuccessModalSwitch(false);
    };

    // 모달창 닫기
    const closeModalHandler = () => {
        setSuccessModalSwitch(false);

        if (action === '모임을 생성') {
            nvg('/group');
        }

        if (action === '모임을 수정') {
            nvg(`/group/home/${gSeq}`);
        }

        if (action === '공지사항을 작성') {
            nvg(`/board/${gSeq}/notice`);
        }

        if (action === '자유/질문을 작성') {
            nvg(`/board/${gSeq}/free`);
        }

        if (action === '미션 인증글을 작성') {
            nvg(`/board/${gSeq}/mission/${mSeq}`);
        }

        if (action === '게시글을 수정') {
            nvg(-1);
        }

        if (action === '환영') {
            nvg('/login');
        }
    };

    return (
        <div>
            <Modal
                className="warning-modal-style"
                overlayClassName="overlay"
                isOpen={successModalSwitch}
                onRequestClose={() => setSuccessModalSwitch(false)}
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
                        <div className="title1">
                            {action === '모임 생성'
                                ? `${groupName} ${action}했습니다 !`
                                : action === '자유/질문을 작성'
                                ? `자유/질문 게시글을 작성했습니다 !`
                                : action === '환영'
                                ? '회원가입 완료 !'
                                : `${action}했습니다 !`}
                        </div>
                        <div style={{ fontSize: '1.4rem', paddingTop: '3rem' }}>
                            {action === '환영'
                                ? '로그인하여 모임에 참여해보세요 👋🏻'
                                : ''}
                        </div>
                    </div>

                    <div className="mission-cancel-btn-container">
                        <button
                            onClick={closeModalHandler}
                            className="btn-md mission-cancel-back-btn"
                        >
                            확인
                        </button>
                    </div>
                </div>
                {/* </div> */}
            </Modal>
        </div>
    );
}
