import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import '../../styles/scss/pages/user/join.scss';

import Nickname from '../../components/common/Nickname';
import CharacterList from '../../components/common/CharacterList';
import InterestedList from '../../components/common/InterestedList';
import { Divider } from '@mui/material';

export default function Join(props: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser'); // 토큰 값

    //-- 회원가입 페이지 구분
    const navigate = useNavigate();

    useEffect(() => {
        props.setIsJoinPage(true);

        // 컴포넌트가 마운트될 때 이벤트 핸들러 등록
        const unmountHandler = () => {
            props.setIsJoinPage(false);
        };

        // 컴포넌트가 언마운트될 때 등록한 이벤트 핸들러 제거
        return () => {
            unmountHandler();
        };
    }, [navigate, props]);

    // [참고] 회원가입 페이지 오자마자 모달창 띄우고 싶으면, 아래 주석 풀면 됩니다.
    // alert('회원가입이 필요합니다.');

    // 전달할 사용자 가입 정보
    interface userInfoItf {
        uEmail: string;
        uName: string;
        uImg: string | null;
        uCharImg: string | null;
        uCategory1: string | null;
        uCategory2: string | null;
        uCategory3: string | null;
    }

    // 관심사 배열
    const [selectedArr, setSelectedArr] = useState<Array<string>>([]);

    // 1. 회원가입 url에서 user 정보 가져오기
    const curPath: string = window.location.href;
    const url: any = new URL(curPath);
    const urlParams: any = new URLSearchParams(url.search);

    const uEmail: string = urlParams.get('userEmail');
    const uName: string = urlParams.get('userName');
    const uImg: string = urlParams.get('userImg');

    for (const [key, value] of urlParams.entries()) {
        console.log(`${key}: ${value}`);
    }
    // 2. 사용자 닉네임 설정
    // const [input, setInput] = useState<string | number>('');

    // 3. 사용자 선택 캐릭터 이미지 값 설정
    const [selectedCharacter, setSelectedCharacter] = useState<string>(
        '/asset/images/emo2.gif'
    );
    const selectCharacter = (characterSrc: string): void => {
        setSelectedCharacter(characterSrc);
    };

    const userInfo: userInfoItf = {
        uEmail: uEmail,
        uName: uName,
        uImg: uImg,
        uCharImg: selectedCharacter,
        uCategory1: selectedArr[0],
        uCategory2: selectedArr[1],
        uCategory3: selectedArr[2],
    };

    const register = async (): Promise<void> => {
        await axios
            .post(`${process.env.REACT_APP_DB_HOST}/user/register`, userInfo, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('회원가입 데이터', res.data);
                alert(
                    'Motimates의 회원이 되신 것을 환영합니다 ! \n로그인하여 모임에 참여해보세요 👋🏻'
                );
            });
    };

    return (
        <div className="section join-container">
            <div className="title3 join-title">회원 가입</div>

            <div className="nickname-sub-div">
                <h3 className="title5" id="nickname-h3">
                    닉네임
                </h3>
                <div>{uName}</div>
            </div>

            <div className="interested-div">
                <div className="interested-div-one">
                    <h3 id="interested-h3">관심 분야</h3>
                    <p className="interested-p">최대 3개</p>
                </div>
                <div className="interested-div-two interested-my-page">
                    <InterestedList
                        selectedArr={selectedArr}
                        setSelectedArr={setSelectedArr}
                        num={3}
                    />
                </div>
            </div>

            <div className="character-sub-div">
                <h3
                    style={{
                        paddingBottom: '2rem',
                    }}
                >
                    캐릭터를 선택해주세요.
                </h3>

                <CharacterList
                    selectedCharacter={selectedCharacter}
                    setSelectedCharacter={setSelectedCharacter}
                    selectCharacter={selectCharacter}
                />
            </div>
            {/* </form> */}

            <Link to="/login">
                <div className="btn-fixed-wrapper">
                    <button
                        id="join-btn"
                        className="btn-fixed"
                        onClick={() => register()}
                    >
                        시작하기
                    </button>
                </div>
            </Link>
        </div>
    );
}
