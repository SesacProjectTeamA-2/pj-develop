import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import '../../styles/scss/components/swiper.scss';

export default function SwiperComponent({
    groupArray,
    setGroupArray,
    madeNumGroup,
}: any) {
    // 랜덤 색상을 선택하는 함수
    const getRandomColor = () => {
        const colors = [
            '#ff6d59',
            '#ffcc77',
            '#83cb77',
            '#ff7373',
            '#7fbeeb',
            '#f399ca',
            '#b78be3',
            '#c4c4c4',
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <div>
            <div className="swiper-button-container">
                <div className="swiper-button-prev">
                    <img src="/asset/icons/left.svg" alt="swiper-button-left" />
                </div>

                <Swiper
                    style={{ cursor: 'pointer' }}
                    className="swiper"
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={2}
                    // slidesPerColumnFill="row"
                    spaceBetween={20}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    modules={[Navigation, Autoplay]}
                    loop={true}
                    autoplay={{ delay: 2000, disableOnInteraction: true }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    pagination={{ clickable: true }}
                    //-- 반응형
                    // breakpoints={{
                    //     700: {
                    //         slidesPerView: 2,
                    //         slidesPerGroup: 2,
                    //     },
                    //     1000: {
                    //         slidesPerView: 3,
                    //         slidesPerGroup: 3,
                    //     },
                    //     1300: {
                    //         slidesPerView: 4,
                    //         slidesPerGroup: 4,
                    //     },
                    // }}

                    //     1378: {
                    //         slidesPerView: 6, // 한번에 보이는 슬라이드 개수
                    //         slidesPerGroup: 6, // 몇개씩 슬라이드 할지
                    //     },
                    //     998: {
                    //         slidesPerView: 5,
                    //         slidesPerGroup: 5,
                    //     },
                    //     625: {
                    //         slidesPerView: 4,
                    //         slidesPerGroup: 4,
                    //     },
                    //     0: {
                    //         slidesPerView: 3,
                    //         slidesPerGroup: 3,
                    //     },
                >
                    {groupArray?.map((groupInfo: any) => {
                        return (
                            <>
                                <SwiperSlide
                                    style={{
                                        // backgroundColor: getRandomColor(),
                                        fontWeight: 'bold',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        alignContent: 'space-between',
                                        justifyItems: 'center',
                                        height: '100%',
                                        width: '100%',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* <div className="container-fluid"> */}
                                    {/* <div className="container"> */}
                                    {/* <div className="row"> */}
                                    {/* <div className="col-sm-4"> */}
                                    <div className="swiper-card card-wrapper">
                                        {/* <div className=" "> */}
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
                                                    {/* <li>
                                                    {' '}
                                                    <i
                                                        className="fa fa-check"
                                                        aria-hidden="true"
                                                    ></i>{' '}
                                                    10 GB Space{' '}
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
                                                </li> */}
                                                </ul>
                                            </div>
                                            <a href="#">Order Now </a>
                                        </div>

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
                                                    {/* <li>
                                                    {' '}
                                                    <i
                                                        className="fa fa-check"
                                                        aria-hidden="true"
                                                    ></i>{' '}
                                                    10 GB Space{' '}
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
                                                </li> */}
                                                </ul>
                                            </div>
                                            <a href="#">Order Now </a>
                                        </div>
                                        {/* </div> */}

                                        {/* ========== TEST 3 ========== */}
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
                                                    {/* <li>
                                                    {' '}
                                                    <i
                                                        className="fa fa-check"
                                                        aria-hidden="true"
                                                    ></i>{' '}
                                                    10 GB Space{' '}
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
                                                </li> */}
                                                </ul>
                                            </div>
                                            <a href="#">Order Now </a>
                                        </div>

                                        {/* ========== TEST 3 ========== */}
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
                                                    {/* <li>
                                                    {' '}
                                                    <i
                                                        className="fa fa-check"
                                                        aria-hidden="true"
                                                    ></i>{' '}
                                                    10 GB Space{' '}
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
                                                </li> */}
                                                </ul>
                                            </div>
                                            <a href="#">Order Now </a>
                                        </div>
                                        {/* </div> */}
                                    </div>

                                    {/* <div className="col-sm-4">
                                                    <div className="card text-center">
                                                        <div className="title">
                                                            <i
                                                                className="fa fa-plane"
                                                                aria-hidden="true"
                                                            ></i>
                                                            <h2>Standard</h2>
                                                        </div>
                                                        <div className="price">
                                                            <h4>
                                                                <sup>$</sup>
                                                                50
                                                            </h4>
                                                        </div>
                                                        <div className="option">
                                                            <ul>
                                                                <li>
                                                                    {' '}
                                                                    <i
                                                                        className="fa fa-check"
                                                                        aria-hidden="true"
                                                                    ></i>{' '}
                                                                    50 GB Space{' '}
                                                                </li>
                                                                <li>
                                                                    {' '}
                                                                    <i
                                                                        className="fa fa-check"
                                                                        aria-hidden="true"
                                                                    ></i>{' '}
                                                                    5 Domain
                                                                    Names{' '}
                                                                </li>
                                                                <li>
                                                                    {' '}
                                                                    <i
                                                                        className="fa fa-check"
                                                                        aria-hidden="true"
                                                                    ></i>{' '}
                                                                    Unlimited
                                                                    Email
                                                                    Address{' '}
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
                                                        <a href="#">
                                                            Order Now{' '}
                                                        </a>
                                                    </div>

                                                    <div className="col-sm-4">
                                                        <div className="card text-center">
                                                            <div className="title">
                                                                <i
                                                                    className="fa fa-rocket"
                                                                    aria-hidden="true"
                                                                ></i>
                                                                <h2>Premium</h2>
                                                            </div>
                                                            <div className="price">
                                                                <h4>
                                                                    <sup>$</sup>
                                                                    100
                                                                </h4>
                                                            </div>
                                                            <div className="option">
                                                                <ul>
                                                                    <li>
                                                                        {' '}
                                                                        <i
                                                                            className="fa fa-check"
                                                                            aria-hidden="true"
                                                                        ></i>{' '}
                                                                        Unlimited
                                                                        GB Space{' '}
                                                                    </li>
                                                                    <li>
                                                                        {' '}
                                                                        <i
                                                                            className="fa fa-check"
                                                                            aria-hidden="true"
                                                                        ></i>{' '}
                                                                        30
                                                                        Domain
                                                                        Names{' '}
                                                                    </li>
                                                                    <li>
                                                                        {' '}
                                                                        <i
                                                                            className="fa fa-check"
                                                                            aria-hidden="true"
                                                                        ></i>{' '}
                                                                        Unlimited
                                                                        Email
                                                                        Address{' '}
                                                                    </li>
                                                                    <li>
                                                                        {' '}
                                                                        <i
                                                                            className="fa fa-check"
                                                                            aria-hidden="true"
                                                                        ></i>{' '}
                                                                        Live
                                                                        Support{' '}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <a href="#">
                                                                Order Now{' '}
                                                            </a>
                                                        </div>
                                                    </div> 
                                                </div>*/}
                                    {/* </div> */}
                                    {/* </div> */}
                                    {/* </div> */}

                                    {/* 검정 카드 2 */}
                                    {/* <figure className="snip1336">
                                        <img
                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg"
                                            alt="sample87"
                                        />
                                        <figcaption>
                                            <img
                                                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample4.jpg"
                                                alt="profile-sample4"
                                                className="profile"
                                            />
                                            <h2>
                                                Hans Down<span>Engineer</span>
                                            </h2>
                                            <p>
                                                I'm looking for something that
                                                can deliver a 50-pound payload
                                                of snow on a small feminine
                                                target. Can you suggest
                                                something? Hello...?{' '}
                                            </p>
                                            <a href="#" className="follow">
                                                Follow
                                            </a>
                                            <a href="#" className="info">
                                                More Info
                                            </a>
                                        </figcaption>
                                    </figure> */}

                                    {/* ========= 기존 버전 ========== */}
                                    {/* <Link to={`/group/home/${groupInfo.gSeq}`}>
                                        <div className="swiper-card">
                                            <span className="title4">
                                                {groupInfo.gName}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                margin: '1rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                opacity: '0.8',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: '#8D6262',
                                                }}
                                                className="title5"
                                            >
                                                D-day
                                            </span>
                                            <br />
                                            <span className="title5">
                                                {groupInfo.gDday}
                                            </span>
                                            <div
                                                style={{
                                                    margin: '2px 30px',
                                                    fontSize: '11px',
                                                }}
                                            > */}
                                    {/* 참석인원 수 {madeNumGroup.count}
                                                /{groupInfo.gMaxMem} */}
                                    {/* <div>남은 일수 : {groupInfo.gDday}</div> */}
                                    {/* </div>
                                        </div> */}

                                    {/* <div>남은 일수 : {groupInfo.gDday}</div> */}
                                    {/* </Link> */}
                                </SwiperSlide>
                            </>
                        );
                    })}
                </Swiper>
                <div className="swiper-button-next">
                    <img
                        src="/asset/icons/right.svg"
                        alt="swiper-button-right"
                    />
                </div>
            </div>
        </div>
    );
}
