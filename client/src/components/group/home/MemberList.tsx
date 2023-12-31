import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

export default function MemberList({
    gMax,
    leaderInfo,
    memberArray,
    groupMember,
}: any) {
    console.log('groupMember', groupMember);
    console.log('leaderInfo', leaderInfo);

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

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

    return (
        <div className="wrapper">
            <div className="members-upper-content">
                <div className="title5">멤버</div>
                <div className="title8 participant-list">
                    참석인원
                    <span className="member-count">
                        {memberArray?.length + 1}
                    </span>
                    / {gMax}
                    <span className="member-left">
                        ({gMax - 1 - memberArray?.length}자리 남음)
                    </span>
                </div>
            </div>
            <div className="main-content  bottom-group-home">
                <ul className="list-unstyled">
                    {/* 모임장 */}
                    <li>
                        <div className="ranking-list">
                            <div className="ranking-list-img-div">
                                <img
                                    src={
                                        leaderInfo?.uImg ||
                                        '/asset/images/user.svg'
                                    }
                                    alt="userImg"
                                />
                            </div>

                            <div className="cur-ranking-content">
                                <div className="member-list-name-text">
                                    {leaderInfo?.uName}
                                </div>
                                <div className="is-leader-div">(모임장) </div>
                            </div>
                        </div>
                    </li>

                    {memberArray?.map((member: any) => {
                        return (
                            <li key={member.id}>
                                <div className="ranking-list">
                                    <img
                                        src={
                                            member?.uImg ||
                                            '/asset/images/user.svg'
                                        }
                                        alt="userImg"
                                    />

                                    <div className="cur-ranking-content">
                                        <div className="member-list-name-text">
                                            {member?.uName}
                                        </div>
                                        {/* <div className="">
                                            {member.description}
                                        </div> */}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
