import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { ListItem } from '@mui/material';

export default function Nickname(props: any): JSX.Element {
    // const [readOnlyVal, setReadOnlyVal] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement>(null);
    // // edit btn 눌렀을 때 focus + 수정 가능 상태로 바뀜
    const changeReadOnly = (): void => {
        inputRef.current?.focus();
    };

    // 마이페이지에서만 수정 버튼 보여주기 + 회원가입 시 input 해제
    const [visibilityMode, setVisibilityMode] = useState<string>('none');

    const curPath: string = window.location.href;
    useEffect(() => {
        if (curPath.includes('mypage')) {
            setVisibilityMode('flex');
        }
        console.log('display', visibilityMode, curPath);
    }, [curPath]);

    if (props.input.length > 20) {
        toast.error('20자 이내로 입력해주세요.', {
            duration: 2000,
        });

        const slicedInput = props.input.slice(0, 10);
        props.setInput(slicedInput);
    } else {
        props.setInput(props.input);
    }

    const cookie = new Cookies();
    const uToken = cookie.get('isUser'); // 토큰 값

    // 펜 버튼 hover event
    const missionEdit = document.querySelector('.mission-edit');
    const missionEditText = document.querySelector(
        '.mission-edit-text'
    ) as HTMLElement | null;

    missionEdit?.addEventListener('mouseover', () => {
        if (missionEditText !== null) {
            missionEditText.style.visibility = 'visible';
        }
    });
    missionEdit?.addEventListener('mouseout', () => {
        if (missionEditText !== null) {
            missionEditText.style.visibility = 'hidden';
        }
    });

    return (
        <div className="nickname-div">
            <label className="input-label">
                {/*  마이페이지 가입 정보 표시 + 수정 가능 */}
                <>
                    <input
                        onChange={(e) => props.setInput(e.target.value)}
                        value={props.input}
                        ref={inputRef}
                        id="input-area"
                        className="input-obj"
                    />
                </>

                <div
                    className="mission-edit"
                    style={{ display: visibilityMode }}
                >
                    <img
                        src="/asset/icons/edit.svg"
                        className="edit-img"
                        alt="editImg"
                    ></img>
                    <div className="title8 mission-edit-text">수정</div>
                </div>
            </label>
        </div>
    );
}
