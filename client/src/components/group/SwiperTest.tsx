import React, { useRef, useState } from 'react';

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
                // grabCursor={true}
                centeredSlides={true}
                // effect={'coverflow'}
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                // navigation={true}
                // hashNavigation={{
                //     watchState: true,
                // }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                modules={[Pagination, Navigation, Autoplay]}
                loop={true}
                className="mySwiper"
                // breakpoints={{
                //     640: {
                //         slidesPerView: 2,
                //         spaceBetween: 20,
                //     },
                //     768: {
                //         slidesPerView: 4,
                //         spaceBetween: 40,
                //     },
                //     1024: {
                //         slidesPerView: 5,
                //         spaceBetween: 50,
                //     },
                // }}
            >
                <SwiperSlide data-hash="slide1">
                    <div>
                        {/* ========== TEST2 ========== */}
                        <div className="card text-center">
                            <div className="title">
                                <i
                                    className="fa fa-paper-plane"
                                    aria-hidden="true"
                                ></i>
                                <h2>Basic</h2>
                            </div>
                            <div className="price">
                                <h4>
                                    <sup>$</sup>
                                    25
                                </h4>
                            </div>
                            <div className="option">
                                <ul>
                                    <li>
                                        <i
                                            className="fa fa-check"
                                            aria-hidden="true"
                                        ></i>
                                        10 GB Space
                                    </li>
                                    <li>
                                        {' '}
                                        <i
                                            className="fa fa-check"
                                            aria-hidden="true"
                                        ></i>{' '}
                                        3 Domain Names{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        <i
                                            className="fa fa-check"
                                            aria-hidden="true"
                                        ></i>{' '}
                                        20 Email Address{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        <i
                                            className="fa fa-times"
                                            aria-hidden="true"
                                        ></i>{' '}
                                        Live Support{' '}
                                    </li>
                                </ul>
                            </div>
                            <a>Order Now </a>
                        </div>
                    </div>
                </SwiperSlide>
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
                <SwiperSlide data-hash="slide6">Slide 6</SwiperSlide>
                <SwiperSlide data-hash="slide7">Slide 7</SwiperSlide>
                <SwiperSlide data-hash="slide8">Slide 8</SwiperSlide>
                <SwiperSlide data-hash="slide9">Slide 9</SwiperSlide>
            </Swiper>
            <div className="swiper-button-next">
                <img src="/asset/icons/right.svg" alt="swiper-button-right" />
            </div>
        </div>
    );
}
