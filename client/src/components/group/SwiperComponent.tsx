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
                                            <div className="title">
                                                <h1> {categories[idx]}</h1>
                                                <h2> {data.gName}</h2>
                                            </div>
                                            <div className="price">
                                                <h4>
                                                    {/* <sup>$</sup> */}
                                                    {/* [추후] 디데이 형식으로 수정 */}
                                                    {data.gDday}
                                                </h4>
                                            </div>

                                            <div className="option">
                                                <ul>
                                                    <li>
                                                        <i
                                                            className="fa fa-check"
                                                            aria-hidden="true"
                                                        ></i>
                                                        참석인원
                                                        {countArray[idx]}/
                                                        {data.gMaxMem}
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
