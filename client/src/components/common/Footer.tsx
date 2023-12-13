import React from 'react';

import '../../styles/scss/layout/footer.scss';

export default function Footer() {
    return (
        <div className="footer-container">
            <div className="fence"></div>

            <div className="title4 footer-content">
                <div className="footer-item">
                    <img
                        src="/asset/logo_tr.svg"
                        alt="motimate logo"
                        className="footer-img"
                    />
                    <div className="word-break">
                        <span>Motimates</span> 서로 motivation을 주는 mates
                    </div>
                    <div className="word-break">
                        <span>Project 기간</span> 2023.10.23 - 2023.11.10
                    </div>
                    <div className="word-break">
                        <span>Skill</span> React, Typescript, Node.js, etc{' '}
                    </div>
                </div>
                <div className="footer-item">
                    <div className="footer-item-title">FE</div>

                    <div>강혜빈</div>
                    <div>김세화</div>
                    <div>최제윤</div>
                </div>
                <div className="footer-item">
                    <div className="footer-item-title">BE</div>

                    <div>문영민</div>
                    <div>문효진</div>
                    <div>최태영</div>
                </div>
                <div className="footer-item">
                    <div className="footer-item-title">관련 링크</div>

                    <div>
                        <a href="https://polydactyl-cello-2db.notion.site/Motimates-4617b0dbabe640deb5336bb2dddcd54a?pvs=4">
                            Notion
                        </a>
                    </div>
                    <div>
                        <a href="https://github.com/SesacProjectTeamA-2">
                            Github
                        </a>
                    </div>
                </div>
                {/* </div> */}

                {/* footer 추가 */}
            </div>
        </div>
    );
}
