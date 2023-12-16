import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import '../../styles/scss/components/swipertest.scss';

export default function SwiperTest({ groupArray, madeNumGroup }: any) {
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
                    0: {
                        slidesPerView: 0,
                        spaceBetween: 5,
                    },
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 5,
                    },
                    400: {
                        slidesPerView: 1,
                        spaceBetween: 8,
                    },
                    500: {
                        slidesPerView: 1,
                        spaceBetween: 8,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    800: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    900: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 25,
                    },
                    1250: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1300: {
                        slidesPerView: 3,
                        spaceBetween: 38,
                    },
                }}
            >
                {groupArray?.map((groupInfo: any) => {
                    return (
                        <>
                            <SwiperSlide
                                data-hash="slide1"
                                style={{
                                    backgroundColor: 'inherit',
                                    border: 'none',
                                }}
                            >
                                <Link
                                    to={`/group/home/${groupInfo.gSeq}`}
                                    className="link-none"
                                >
                                    <div className="swiper-group-wrapper">
                                        <div className="card text-center">
                                            <div className="title">
                                                {/* [추후] 카테고리별 icon */}
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
                                            <button>자세히</button>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        </>
                    );
                })}
                {/* <SwiperSlide data-hash="slide2">
                    <div>
                        <div className="card text-center">
                            <div>hi</div>
                        </div>
                    </div>
                </SwiperSlide> */}
            </Swiper>
            <div className="swiper-button-next">
                <img src="/asset/icons/right.svg" alt="swiper-button-right" />
            </div>
        </div>
    );
}
