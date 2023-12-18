import React, { useEffect, useState } from 'react';
import 'animate.css';
import '../../styles/scss/pages/user/login.scss';

import GoogleLoginBtn from '../../components/login/GoogleLoginBtn';
import NaverLoginBtn from '../../components/login/NaverLoginBtn';
import KakaoLoginBtn from '../../components/login/KakaoLoginBtn';
import TesterLoginBtn1 from 'src/components/login/TesterLoginBtn1';
import TesterLoginBtn2 from 'src/components/login/TesterLoginBtn2';
import { useNavigate } from 'react-router-dom';

export default function Login(props: any) {
    // 로그인 버튼
    const testLogin1 = (testNum: number): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/test?testNum=${testNum}`;
    };

    const testLogin2 = (testNum: number): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/test?testNum=${testNum}`;
    };

    const googleLogin = (): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/google`;
    };

    const kakaoLogin = (): void => {
        window.location.href = `${process.env.REACT_APP_DB_HOST}/user/login/kakao/authorize`;
    };
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

    const [idValue, setIdValue] = useState('');
    const [pwValue, setPwValue] = useState('');

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

                        <GoogleLoginBtn
                            onClick={() => googleLogin()}
                            align="center"
                            className="loginBtn"
                        ></GoogleLoginBtn>

                        <KakaoLoginBtn
                            onClick={(): void => kakaoLogin()}
                            align="center"
                            className="loginBtn"
                        />

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
                        <input
                            type="text"
                            value={idValue}
                            placeholder="관리자 ID"
                            className="id-input"
                        />
                        <input
                            type="text"
                            value={pwValue}
                            placeholder="관리자 PW"
                            className="pw-input"
                        />
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
