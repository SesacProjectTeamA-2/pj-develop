import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import '../../styles/scss/components/swiper.scss';

export default function SwiperTest({
    groupArray,
    color1,
    color2,
    memberCount,
}: any) {
    let categories: any = [];
    let countArray: any = [];

    // 카테고리
    for (let i = 0; i < groupArray.length; i++) {
        switch (groupArray[i].gCategory) {
            case 'ex':
                categories.push('🏃🏻‍♂️');
                break;
            case 're':
                categories.push('📚');
                break;
            case 'lan':
                categories.push('🔠');
                break;
            case 'cert':
                categories.push('🪪');
                break;
            case 'st':
                categories.push('✍🏻');
                break;
            case 'eco':
                categories.push('💵');
                break;
            case 'it':
                categories.push('🌐');
                break;
            case 'etc':
                categories.push('👥');
                break;
        }
    }

    // console.log(categories);

    // 현재 참석 멤버수
    for (let i = 0; i < memberCount.length; i++) {
        countArray.push(memberCount[i].count);
    }
    // console.log(countArray);

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
                {groupArray?.map((data: any, idx: number) => {
                    return (
                        <>
                            {/* 기존 코드 */}

                            <SwiperSlide
                                data-hash="slide1"
                                style={{
                                    backgroundColor: 'inherit',
                                    border: 'none',
                                }}
                            >
                                <Link
                                    to={`/group/home/${data.gSeq}`}
                                    className="link-none"
                                >
                                    <div className="swiper-group-wrapper">
                                        <div
                                            className="card text-center"
                                            style={{
                                                background: `linear-gradient(-45deg, ${color1},${color2})`,
                                            }}
                                        >
                                            <div>
                                                <li>
                                                    <h2> {categories[idx]}</h2>
                                                </li>

                                                <li className="title-card swiper-title-text">
                                                    {data.gName}
                                                </li>
                                            </div>
                                            <li className="swiper-dday-text">
                                                {/* <div className="price"> */}
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    height="1.4em"
                                                    width="1.4em"
                                                >
                                                    <path d="M7 10h5v5H7m12 4H5V8h14m0-5h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
                                                </svg>
                                                {data.gDday}
                                                {/* </div> */}
                                            </li>

                                            <div className="option">
                                                <ul>
                                                    <li className="attend-member-count">
                                                        {/* <i
                                                  className="fa fa-check"
                                                  aria-hidden="true"
                                              ></i> */}
                                                        참석 인원&nbsp;
                                                        <b>
                                                            {countArray[idx]}
                                                            &nbsp;/&nbsp;
                                                            {data.gMaxMem}
                                                        </b>
                                                    </li>
                                                    <li>
                                                        {/* <div
                                                            style={{
                                                                fontSize:
                                                                    '2rem',
                                                            }}
                                                        >
                                                    
                                                        </div> */}
                                                        {/* {groupInfo.gCategory} */}
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* --- 이미 참여한 상태이므로 필요 없음 --- */}
                                            {/* {data.gMaxMem - countArray[idx] >
                                            0 ? (
                                                <button>참석 가능</button>
                                            ) : (
                                                <button>마감</button>
                                            )} */}
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
