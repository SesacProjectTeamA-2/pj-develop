import React, { useRef } from 'react';

import '../../styles/scss/layout/footer.scss';

export default function Footer() {
    return (
        <div className="container">
            {/* <div className="footer-container"> */}

            <div className="dark-layer"></div>

            <div className="text-big">
                <h1>MOTI</h1>
            </div>
            <div className="info">
                {/* LOGO */}
                <div className="logo-wrapper">
                    <img
                        src="/asset/logo_tr.svg"
                        alt="motimate logo"
                        className="footer-img"
                    />
                    <div className="word-break">
                        <span>Motimates</span>
                        <div>서로 motivation을 주는 mates</div>
                    </div>
                </div>

                {/* TEAM */}
                <div className="team-wrapper social-links">
                    <h2>Team</h2>

                    <p>
                        <div className="team-title">Renewal</div>
                        <div className="renewal-footer-text-wrapper">
                            <a
                                href="https://github.com/loveflora"
                                className="link-none profile-hover"
                                target="_blank"
                            >
                                <span> Front </span>
                                <span>| </span>
                                <span>김세화 (Project Leader)</span>
                            </a>
                            <div>
                                <a
                                    href="https://github.com/chitty12"
                                    className="link-none profile-hover"
                                    target="_blank"
                                >
                                    <span> Back </span>
                                    <span>| </span>
                                    <span>최태영</span>
                                </a>
                            </div>
                        </div>
                    </p>

                    <p className="origin-team-wrapper">
                        <div className="team-title">Origin</div>
                        <div className="team-member">
                            <div>
                                <span> Front </span>
                                <span>| </span>
                                <span>김세화, 강혜빈, 최제윤</span>
                            </div>
                            <div>
                                <span> Back </span>
                                <span>| </span>
                                <span>최태영, 문영민, 문효진</span>
                            </div>
                        </div>
                    </p>
                </div>

                {/* LINK */}
                <div className="link-wrapper social-links">
                    <h2>Link</h2>
                    <div className="social-icons">
                        <li>
                            <a href="https://github.com/SesacProjectTeamA-2/pj-develop">
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1.4em"
                                    width="1.4em"
                                >
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                                Github
                            </a>
                        </li>

                        <li>
                            <a href="https://polydactyl-cello-2db.notion.site/Motimates-4617b0dbabe640deb5336bb2dddcd54a?pvs=4">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1.4em"
                                    width="1.4em"
                                >
                                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                                </svg>
                                Notion
                            </a>
                        </li>
                    </div>
                </div>

                {/* EMAIL */}
                <div className="email-wrapper social-links">
                    <h2>Contact us</h2>

                    <div>
                        <p>문의 사항 | 기타 의견 | 에러 신고 </p>

                        <p>아래로 연락주세요 !</p>
                    </div>

                    <div className="contact-footer-text-wrapper">
                        <a
                            href="mailto:love7620640@naver.com"
                            className="dev-contact"
                        >
                            <div className="dev-contact">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1.5em"
                                    width="1.5em"
                                >
                                    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6m-2 0l-8 5-8-5h16m0 12H4V8l8 5 8-5v10z" />
                                </svg>
                                <span> Front </span>
                                {/* <span>| </span> */}
                                <span>김세화</span>
                            </div>
                        </a>

                        <a
                            href="mailto:cty12angel@naver.com"
                            className="dev-contact"
                        >
                            <div className="dev-contact">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1.5em"
                                    width="1.5em"
                                >
                                    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6m-2 0l-8 5-8-5h16m0 12H4V8l8 5 8-5v10z" />
                                </svg>
                                <span> Back </span>
                                {/* <span>| </span> */}
                                <span>최태영</span>
                            </div>
                        </a>
                    </div>

                    {/* <input /> */}

                    {/* <button>Contact</button> */}

                    <div className="frame">
                        <input type="checkbox" id="cb" />
                        <label htmlFor="cb" className="button">
                            Click
                        </label>
                        <label htmlFor="cb" className="button reset">
                            Reset
                        </label>
                        <div className="circle"></div>
                        <div className="circle-outer"></div>
                        <svg className="icon mail">
                            <polyline points="119,1 119,69 1,69 1,1"></polyline>
                            <polyline points="119,1 60,45 1,1 119,1"></polyline>
                        </svg>
                        <svg className="icon plane">
                            <polyline points="119,1 1,59 106,80 119,1"></polyline>
                            <polyline points="119,1 40,67 43,105 69,73"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
            {/* <div>
                Created for
                <a
                    href="https://polydactyl-cello-2db.notion.site/Motimates-4617b0dbabe640deb5336bb2dddcd54a?pvs=4"
                    target="blank"
                >
                    Portfolio
                </a>
                @Motimates
            </div> */}

            {/* 기존 footer */}

            {/* <div className="word-break">
                <span>Skill</span> React, Typescript, Node.js, etc{' '}
            </div> */}

            {/* </div> */}
        </div>
    );
}
