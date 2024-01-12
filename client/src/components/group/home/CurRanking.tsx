import React, { useEffect, useState } from 'react';
import Progressbar from '../../common/Progressbar';

export default function CurRanking({
    nowRanking,
    groupMember,
    nowScoreRanking,
    userImgSrc,
    isLeader,
}: any) {
    return (
        <div className="wrapper">
            <div className="upper-content">
                <div className="title5">현재 랭킹</div>
                <div className="title6 group-home-duration">
                    {/* [추후] 몇회차인지 */}
                    {/* <div className="group-home-mission-round-text">5회차</div> */}
                    <div>
                        {/* [추후] 기간 데이터 연동 */}
                        {/* 2023.10.20-2023.10.30 */}
                    </div>
                </div>
            </div>
            <div className="main-content">
                <ul className="list-unstyled">
                    {nowRanking?.map((now: any, idx: number) => {
                        return (
                            <li>
                                <div className="ranking-list-cur">
                                    <div className="ranking">{idx + 1}</div>

                                    <img
                                        src={
                                            now.uImg || '/asset/images/user.svg'
                                        }
                                        alt="userImg"
                                    />

                                    <div className="name-bar-wrapper">
                                        <div className="name">{now.uName}</div>

                                        <Progressbar
                                            score={nowScoreRanking[idx]}
                                            bg={'#e0e0e0'}
                                            barColor={
                                                isLeader ? '#f5e060' : '#f78c99'
                                            }
                                        />
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
