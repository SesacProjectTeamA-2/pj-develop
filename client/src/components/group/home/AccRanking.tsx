import React from 'react';

export default function AccRanking({
    totalRanking,
    totalScoreRanking,
    userImgSrc,
}: any) {
    return (
        <div className="wrapper">
            <div className="upper-content">
                <div className="title5">누적 랭킹</div>
                <div className="title6 group-home-duration">
                    {/* [추후] 기간 데이터 연동 */}
                    {/* 2023.09.30-2023.10.30 */}
                </div>
            </div>
            <div className="main-content acc-rank-box">
                <ul className="list-unstyled">
                    {totalRanking?.map((total: any, idx: number) => {
                        return (
                            <li>
                                <div className="ranking-list-acc">
                                    <div className="title4">{idx + 1}</div>
                                    <img
                                        src={
                                            total.uImg ||
                                            '/asset/images/user.svg'
                                        }
                                        alt="uerImg"
                                    />
                                    <div className="name acc-name">
                                        {total.uName}
                                    </div>
                                    <div className="cur-ranking-content">
                                        <div className="score">
                                            {
                                                totalScoreRanking[idx]
                                                    .guTotalScore
                                            }
                                        </div>
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
