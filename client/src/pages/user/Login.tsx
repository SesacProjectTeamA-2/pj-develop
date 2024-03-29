import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'animate.css';
import '../../styles/scss/pages/user/login.scss';

import GoogleLoginBtn from '../../components/login/GoogleLoginBtn';
import NaverLoginBtn from '../../components/login/NaverLoginBtn';
import KakaoLoginBtn from '../../components/login/KakaoLoginBtn';
import TesterLoginBtn1 from 'src/components/login/TesterLoginBtn1';
import TesterLoginBtn2 from 'src/components/login/TesterLoginBtn2';
import { IconButton, TextField } from '@mui/material';

export default function Login(props: any) {
    // 로그인 버튼
    const testLogin1 = (testNum: number): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/test?testNum=${testNum}`;
    };

    const testLogin2 = (testNum: number): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/test?testNum=${testNum}`;
    };

    // const googleLogin = (): void => {
    //     window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/google`;
    // };

    // const kakaoLogin = (): void => {
    //     window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/kakao/authorize`;
    // };

    const naverLogin = (): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/naver`;
    };

    // 숨은 이스터 에그 효과
    const [isHingeAnimated, setIsHingeAnimated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleHingeAnimation = () => {
        setIsHingeAnimated(!isHingeAnimated);
    };

    // 마우스 클릭 효과
    function clickEffect(e: MouseEvent): void {
        const d = document.createElement('div');
        d.className = 'clickEffect';
        d.style.top = e.clientY + 'px';
        d.style.left = e.clientX + 'px';
        document.body.appendChild(d);
        d.addEventListener('animationend', () => {
            d.parentElement?.removeChild(d);
        });
    }

    document.addEventListener('click', clickEffect);

    //-- 로그인 페이지 구분
    const navigate = useNavigate();

    useEffect(() => {
        props.setIsLogin(true);

        // 컴포넌트가 마운트될 때 이벤트 핸들러 등록
        const unmountHandler = () => {
            props.setIsLogin(false);
        };

        // 컴포넌트가 언마운트될 때 등록한 이벤트 핸들러 제거
        return () => {
            unmountHandler();
        };
    }, [navigate, props]);

    //] Admin
    const isAdminHandler = () => {
        setIsAdmin(true);
    };

    const [pwValue, setPwValue] = useState('');

    const pwOnChange = (e: any) => {
        setPwValue(e.target.value);
    };
    const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

    //] 일치하는지 확인
    const checkAdminHandler = () => {
        console.log(pwValue);

        if (pwValue === '1234') {
            props.setAdminUser(true);

            localStorage.setItem('adminUser', 'true');

            navigate('/management');
        } else {
            setIsPasswordIncorrect(true);
        }
    };

    //-- key down event 입력 시
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) {
            return;
        }

        if (event.key === 'Enter') {
            checkAdminHandler();
        }
    };

    return (
        <div className="section login-section">
            <p
                id="welcome"
                onClick={toggleHingeAnimation}
                className={`${isHingeAnimated ? 'animate__hinge' : ''}`}
            >
                welcome
            </p>
            <div className="login">
                <div className="form">
                    <form className="login-form">
                        <TesterLoginBtn1
                            className="guest-btn"
                            onClick={() => testLogin1(1)}
                        >
                            GUEST 1
                        </TesterLoginBtn1>

                        <TesterLoginBtn2
                            className="guest-btn"
                            onClick={() => testLogin2(2)}
                        >
                            GUEST 2
                        </TesterLoginBtn2>

                        {/* <GoogleLoginBtn
                            onClick={() => googleLogin()}
                            align="center"
                            className="loginBtn"
                        ></GoogleLoginBtn>

                        <KakaoLoginBtn
                            onClick={(): void => kakaoLogin()}
                            align="center"
                            className="loginBtn"
                        /> */}

                        <NaverLoginBtn
                            onClick={(): void => naverLogin()}
                            align="center"
                            className="loginBtn"
                        />
                    </form>

                    <div
                        className={`${
                            isAdmin
                                ? 'admin-input-container admin-input-show'
                                : 'admin-input-container'
                        }`}
                    >
                        <div className="admin-input">
                            <TextField
                                id="filled-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="filled"
                                value={pwValue}
                                onChange={pwOnChange}
                                onKeyDown={handleKeyDown}
                            />
                            <p>ADMIN PW : 1234</p>
                            {isPasswordIncorrect ? (
                                <div className="wrong-admin-text">
                                    일치하지 않습니다
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div>
                            <IconButton
                                aria-label="fingerprint"
                                color="secondary"
                                className="admin-enter-btn"
                                onClick={checkAdminHandler}
                            >
                                {/* <Fingerprint /> */}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="black"
                                    height="2em"
                                    width="2em"
                                >
                                    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12 3c-1.97 0-3.85.47-5.56 1.41-.24.13-.54.04-.68-.2a.506.506 0 01.2-.68C7.82 2.5 9.86 2 12 2s4 .47 6.04 1.5c.25.15.34.45.21.69a.48.48 0 01-.44.28M3.5 9.72c-.1 0-.2-.03-.29-.09a.517.517 0 01-.12-.7c.99-1.4 2.25-2.5 3.75-3.27C10 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.85 3.75 3.25.16.22.1.54-.12.7-.23.16-.54.11-.7-.1a9.257 9.257 0 00-3.39-2.96c-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.95-.08.15-.23.22-.39.22m6.25 12.07c-.13 0-.25-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39a.5.5 0 01-.5.5.5.5 0 01-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.84.64 1.16 1.08 1.65 1.85 2.43.19.2.19.51 0 .71-.12.1-.24.15-.37.15m7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39a.5.5 0 01.5-.5.5.5 0 01.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.54.13.58.41.05.26-.13.53-.41.58-.57.11-1.07.12-1.21.12M14.91 22h-.13c-1.59-.46-2.63-1.05-3.72-2.12a7.28 7.28 0 01-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.95 1.94 2.08 1.94 1.15 0 2.08-.87 2.08-1.94 0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.46 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64a.504.504 0 01-.64-.29c-.5-1.31-.73-2.62-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.54 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94-1.7 0-3.08-1.32-3.08-2.94 0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.84.27.08.42.36.35.62-.05.23-.26.38-.47.38z" />
                                </svg>
                            </IconButton>
                        </div>
                        {/* <input
                            type="text"
                            value={idValue}
                            placeholder="ID : admin"
                            className="id-input"
                        />
                        <input
                            type="text"
                            value={pwValue}
                            placeholder="PW : 123"
                            className="pw-input"
                            onChange={onChange}
                        /> */}
                    </div>

                    <img
                        src="asset/images/pebble.png"
                        alt="admin"
                        className={`${
                            isAdmin ? 'roll-out-right' : 'pebble-img'
                        }`}
                        onClick={isAdminHandler}
                    />
                    <div className="pebble-text">Are you admin ?</div>
                </div>
            </div>
        </div>
    );
}
