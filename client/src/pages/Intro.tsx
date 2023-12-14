import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/scss/pages/intro.scss';
import Text from './Text';

import JSConfetti from 'js-confetti'; // 빵빠레

export default function Intro(props: any) {
    const navigate = useNavigate();

    //-- 채팅 아이콘 제외
    useEffect(() => {
        props.setIsIntro(true);

        // 페이지를 벗어날 때 이벤트 핸들러 등록
        // const handleLeavePage = () => {
        //     // 페이지를 벗어날 때 setIsIntro(false) 호출
        //     props.setIsIntro(false);
        // };

        // 컴포넌트가 마운트될 때 이벤트 핸들러 등록
        const unmountHandler = () => {
            props.setIsIntro(false);
        };

        // 컴포넌트가 언마운트될 때 등록한 이벤트 핸들러 제거
        return () => {
            unmountHandler();
        };
    }, [navigate, props]);

    //HTML Canvas 요소를 생성하여 페이지에 추가
    const jsConfetti = new JSConfetti();

    const cursor = document.querySelector<HTMLElement>('.custom-cursor');
    const links = document.querySelectorAll('a');
    let isCursorInited = false;

    const initCursor = () => {
        if (cursor) {
            cursor.classList.add('custom-cursor--init');
            isCursorInited = true;
        }
    };

    const destroyCursor = () => {
        if (cursor) {
            cursor.classList.remove('custom-cursor--init');
            isCursorInited = false;
        }
    };

    links.forEach((link) => {
        link.addEventListener('mouseover', () => {
            if (cursor) {
                cursor.classList.add('custom-cursor--link');
                cursor.classList.remove('custom-cursor--link');
            }
        });

        link.addEventListener('mouseout', () => {
            if (cursor) {
                cursor.classList.remove('custom-cursor--link');
            }
        });
    });

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (!isCursorInited) {
            initCursor();
        }

        if (cursor) {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
    });

    document.addEventListener('mouseout', destroyCursor);

    // canvas effect
    useEffect(() => {
        var partNum = 70;

        var c: any = document.getElementById('c');
        var ctx = c.getContext('2d');

        var w = window.innerWidth;
        var h = window.innerHeight;

        var mouse = {
            x: w / 2,
            y: 0,
        };

        document.addEventListener(
            'mousemove',
            function (e) {
                mouse.x = e.clientX || e.pageX;
                mouse.y = e.clientY || e.pageY;
            },
            false
        );

        class Particle {
            x: number;
            y: number;
            r: number;

            constructor() {
                this.x = Math.random() * w - w / 5;
                this.y = Math.random() * h;

                this.r = Math.random() * 7.5 + 3.25;
            }
        }

        var particles: any = [];

        for (let i = 0; i < partNum; i++) {
            particles.push(new Particle());
        }

        var draw = function () {
            c.width = w;
            c.height = h;

            for (let t = 0; t < particles.length; t++) {
                var p = particles[t];
                var nowX = p.r + mouse.x / 4.6;
                var nowY = p.r + mouse.y / 4.6;
                var color = '#ffffffca';

                if (p.r < 10) {
                    nowX = p.x + mouse.x / 0.5;
                    nowY = p.y + mouse.y / 0.5;
                }
                if (p.r < 9) {
                    nowX = p.x + mouse.x / 2;
                    nowY = p.y + mouse.y / 2;
                }
                if (p.r < 8) {
                    nowX = p.x + mouse.x / 3.5;
                    nowY = p.y + mouse.y / 3.5;
                }
                if (p.r < 7) {
                    nowX = p.x + mouse.x / 5;
                    nowY = p.y + mouse.y / 5;
                }
                if (p.r < 6) {
                    nowX = p.x + mouse.x / 6.5;
                    nowY = p.y + mouse.y / 6.5;
                }
                if (p.r < 5) {
                    nowX = p.x + mouse.x / 8;
                    nowY = p.y + mouse.y / 8;
                }
                if (p.r < 4) {
                    nowX = p.x + mouse.x / 9.5;
                    nowY = p.y + mouse.y / 9.5;
                }
                if (p.r < 3) {
                    nowX = p.x + mouse.x / 11;
                    nowY = p.y + mouse.y / 11;
                }
                if (p.r < 2) {
                    nowX = p.x + mouse.x / 12.5;
                    nowY = p.y + mouse.y / 12.5;
                }
                if (p.r < 1) {
                    nowX = p.x + mouse.x / 15;
                    nowY = p.y + mouse.y / 15;
                }

                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(nowX, nowY, p.r, Math.PI * 2, false);
                ctx.fill();
            }
        };

        setInterval(draw, 30);
    }, []);

    //색종이 커스터마이징
    const handleClick = () => {
        jsConfetti.addConfetti({
            // confettiColors: [
            //     '#ff0a54',
            //     '#ff477e',
            //     '#ff7096',
            //     '#ff85a1',
            //     '#fbb1bd',
            //     '#f9bec7',
            // ],
            emojis: ['🎉', '💵', '🏆'],
            emojiSize: 120,
            confettiNumber: 30,
        });
    };

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const containerClassName = `section intro-container ${
        isHovered
            ? 'party-btn animate__animated animate__rubberBand'
            : 'party-btn '
    }`;

    return (
        <div className="section intro-container">
            <div className="intro-header">
                <div className="video-container">
                    <video muted autoPlay loop>
                        <source src="/asset/team.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="intro-title title1">
                    <div className="video-title">
                        <div>We</div>
                        <div>Grow</div>
                        <div>Together</div>
                    </div>
                    <div className="sub-title title2">
                        함께 성장하며 가치를 공유합니다.
                    </div>
                </div>
            </div>

            <div className="empty-div"></div>

            <Text value="MOTI" />
            <Text value="MATES!" />

            <div>
                <canvas id="c"></canvas>

                <div className="intro-content main-text">
                    <div className="intro-moti-text">
                        여러분의 동료, <br />
                        MOTIMATES를 소개합니다 !
                    </div>
                    <br />
                    <div className="intro-content-sub-title">
                        팀원들과 함께 목표를 이뤄나가요.
                    </div>
                </div>
            </div>

            <div className="intro-content">
                <div className="start-group-title">
                    손쉽게 모임을 시작해보세요.
                </div>
                <br />
                <div className="intro-content-sub-title">
                    나와 관심사가 비슷한 사람들과 함께 즐겁게 성장하세요 !
                </div>
            </div>

            <div className="empty-div"></div>

            <div className="wrapper">
                <div className="debate-video">
                    <video muted autoPlay loop>
                        <source src="/asset/whiteboard.mp4" type="video/mp4" />
                    </video>

                    <div className="debate-title title1">
                        <div className="debate-title-text">
                            <div>열띤 토론을 즐겨요</div>
                        </div>
                        <div className="debate-sub-title title3">
                            동료들과 의견을 주고 받으며,
                            <br />
                            새로운 인사이트를 서로 얻어가요.
                        </div>
                    </div>
                </div>

                <div className="vid-empty-div"></div>

                <div className="video-container win-vid">
                    <video muted autoPlay loop>
                        <source src="/asset/dday.mp4" type="video/mp4" />
                    </video>

                    <div className="dday-title title1">
                        <div className="dday-title-text">
                            <div>마감기한 설정 기능</div>
                        </div>
                        <div className="dday-sub-title title3">
                            데드라인이 있어야, 달릴 맛이 나죠 !
                            <br /> 모임별 디데이를 향해 다같이 나아가요.
                        </div>
                    </div>
                </div>

                <div className="vid-empty-div"></div>

                <div className="video-container win-vid">
                    <video muted autoPlay loop>
                        <source src="/asset/win.mp4" type="video/mp4" />
                    </video>

                    <div className="win-title title1">
                        <div className="win-title-text">
                            <div>랭킹 시스템을 통한 동기부여</div>
                        </div>
                        <div className="win-sub-title title3">
                            혼자하면서 금방 지치지 않으셨나요 ?
                            <br />
                            잠자고 있던 여러분의 승부욕을 불태울 시간입니다.🔥
                            <br />
                            여러분의 현실게임 캐릭터,
                            <br />
                            모티메이트 랭킹을 올리는 재미를 느끼세요 !
                        </div>
                        <div className="party-btn-wrapper">
                            <button
                                onClick={handleClick}
                                className={containerClassName}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                WIN !
                            </button>
                        </div>
                    </div>
                </div>

                <div className="vid-empty-div"></div>

                <div className="video-container win-vid">
                    <video muted autoPlay loop>
                        <source src="/asset/chat.mp4" type="video/mp4" />
                    </video>

                    <div className="win-title title1">
                        <div className="win-title-text">
                            <div>채팅 시스템</div>
                        </div>
                        <div className="win-sub-title title2">
                            실시간으로 팀원들과 이야기를 나눠요 !
                        </div>
                    </div>
                </div>
            </div>

            <div className="empty-div"></div>

            <div className="char-img">
                <img src="/asset/images/rab1.svg" alt="" />
                <img src="/asset/images/rab2.svg" alt="" />
                <img src="/asset/images/rab3.svg" alt="" />
            </div>
            <div className="intro-content">
                <div className="start-group-title">
                    캐릭터의 표정이 변해요 !
                </div>
                <br />
                <div className="intro-content-sub-title">
                    달성률에 따라 캐릭터가 웃을 수도, 울 수도 있어요 ~ 😆 🙂 😭
                </div>
            </div>
            <div className="custom-cursor "></div>

            <div className="story-wrapper">
                <div className="intro-story">
                    <div id="ui">
                        <div className="sun">
                            <div className="story-content">
                                <Link to="https://polydactyl-cello-2db.notion.site/Motimates-4617b0dbabe640deb5336bb2dddcd54a?pvs=4">
                                    <div className="title3 story-title">
                                        MOTIMATES
                                        <br />
                                        이야기
                                    </div>
                                    <br />
                                    {/* <div className="story-detail">
                                        자세히 보기
                                        <br />
                                        <br />
                                    </div> */}
                                </Link>
                            </div>
                        </div>

                        <div className="sea">
                            <div className="wave"></div>
                            <div className="wave"></div>
                            <div className="wave"></div>
                            <div className="wave"></div>
                            <div className="wave"></div>
                            <div className="wave"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
