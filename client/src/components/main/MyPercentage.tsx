import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';

export default function MyPercentage() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    // 캐릭터 이미지 가져오기
    const [selectedCharacter, setSelectedCharacter] = useState<
        string | undefined
    >('/asset/images/sqr1.svg');
    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log('getUserData 로그인 후 ', res.data);
                const { character } = res.data; //null

                if (character !== null && character !== undefined) {
                    setSelectedCharacter(character);
                    console.log('character 있음', character);
                } else {
                    setSelectedCharacter('/asset/images/sqr1.svg');
                    console.log('character 없음', character);
                }
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        if (cookie.get('isUser')) {
            getUserData();
            console.log('캐릭터 메인 로그인');
        } else {
            console.log('캐릭터 메인 비로그인');
            return;
        }
    }, []);

    return (
        <div className="content-grid-box">
            <div className="percentage-div">
                <div className="title4">My 달성률 </div>
                <div className="progress-img-flex">
                    <div className="progress-bar-div">
                        <div>
                            <div className="title5">코딩학당</div>
                            <div className="title5">근손실방지</div>
                        </div>
                        <div className="progress-bar-flex">
                            <div>
                                <div className="progress-div">
                                    <div className="my-progress">
                                        <div className="my-bar-one"></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="progress-div">
                                    <div className="my-progress">
                                        <div className="my-bar-two"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            src={selectedCharacter}
                            alt="캐릭터"
                            className="my-progress-img"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
