import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Autoplay, Pagination } from 'swiper/modules';

// // Import Swiper styles
import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

import '../../styles/scss/components/swipertest.scss';

export default function SwiperTest({
    groupArray,
    setGroupArray,
    madeNumGroup,
}: any) {
    return (
        <div className="swiper-button-container">
            <div className="swiper-button-prev">
                <img src="/asset/icons/left.svg" alt="swiper-button-left" />
            </div>
            <Swiper
                slidesPerView={2}
                centeredSlides={true}
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                // grabCursor={true}
                // effect={'coverflow'}
                // hashNavigation={{
                //     watchState: true,
                // }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                modules={[Pagination, Navigation, Autoplay]}
                loop={true}
                className="mySwiper"
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                }}
            >
                {groupArray?.map((groupInfo: any) => {
                    return (
                        <>
                            <SwiperSlide data-hash="slide1">
                                <Link
                                    to={`/group/home/${groupInfo.gSeq}`}
                                    className="link-none"
                                >
                                    <div className="overlay">
                                        <div className="card text-center">
                                            <div className="title">
                                                <i
                                                    className="fa fa-paper-plane"
                                                    aria-hidden="true"
                                                ></i>
                                                <h2> {groupInfo.gName}</h2>
                                            </div>
                                            <div className="price">
                                                <h4>
                                                    {/* <sup>$</sup> */}
                                                    {/* [추후] 디데이 형식으로 수정 */}
                                                    {groupInfo.gDday}

                                                    {/* [추후] 관심분야 */}
                                                </h4>
                                            </div>
                                            <div className="option">
                                                <ul>
                                                    <li>
                                                        <i
                                                            className="fa fa-check"
                                                            aria-hidden="true"
                                                        ></i>
                                                        참석인원 수
                                                        {/* {madeNumGroup.count}/ */}
                                                        {groupInfo.gMaxMem}
                                                    </li>
                                                </ul>
                                            </div>
                                            <button>보러 가기</button>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        </>
                    );
                })}
                <SwiperSlide data-hash="slide2">
                    <div>
                        {/* ========== TEST2 ========== */}
                        <div className="card text-center">
                            <div>hi</div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide data-hash="slide3">Slide 3</SwiperSlide>
                <SwiperSlide data-hash="slide4">Slide 4</SwiperSlide>
                <SwiperSlide data-hash="slide5">Slide 5</SwiperSlide>
            </Swiper>
            <div className="swiper-button-next">
                <img src="/asset/icons/right.svg" alt="swiper-button-right" />
            </div>
        </div>
    );
}
