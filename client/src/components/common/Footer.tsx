import React from 'react';

import '../../styles/scss/layout/footer.scss';

export default function Footer() {
    return (
        <div className="container">
            {/* <div className="footer-container"> */}
            {/* <div className="fence"></div> */}
            <div className="dark-layer"></div>
            <div className="text-big">
                <h1>MOTI</h1>
            </div>
            <div className="info">
                <h2>
                    We can't find <span>that page</span>
                </h2>
                <p>
                    We're pretty sure <span>that page</span> used to be here but
                    seems to have gone missing. We apologize on behalf of{' '}
                    <span>that page</span>.
                </p>
                <button>Contact</button>
            </div>

            {/* 내용 참고 */}
            <div className="row">
                <div className="col-md-3">
                    {/* <a href="index.html"><img src="https://logo-download.com/wp-content/data/images/2021/08/Levi_Strauss__Co.-Logo.png" alt="" className="img-fluid logo-footer"></a> */}
                    <div className="footer-about">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,{' '}
                        </p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="useful-link">
                        <h2>Useful Links</h2>
                        {/* <img src="./assets/images/about/home_line.png" alt="" className="img-fluid"> */}
                        <div className="use-links">
                            <li>
                                <a href="index.html">
                                    <i className="fa-solid fa-angles-right"></i>{' '}
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="about.html">
                                    <i className="fa-solid fa-angles-right"></i>{' '}
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="gallery.html">
                                    <i className="fa-solid fa-angles-right"></i>{' '}
                                    Gallery
                                </a>
                            </li>
                            <li>
                                <a href="contact.html">
                                    <i className="fa-solid fa-angles-right"></i>{' '}
                                    Contact
                                </a>
                            </li>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="social-links">
                        <h2>Follow Us</h2>
                        {/* <img src="./assets/images/about/home_line.png" alt=""> */}
                        <div className="social-icons">
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-facebook-f"></i>{' '}
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-instagram"></i>{' '}
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-linkedin-in"></i>{' '}
                                    Linkedin
                                </a>
                            </li>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="address">
                        <h2>Address</h2>
                        {/* <img src="./assets/images/about/home_line.png" alt="" className="img-fluid"> */}
                        <div className="address-links">
                            <li className="address1">
                                <i className="fa-solid fa-location-dot"></i>{' '}
                                Kolathur ramankulam- Malappuram Dt Kerala 679338
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-phone"></i> +91
                                    90904500112
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-solid fa-envelope"></i>{' '}
                                    mail@1234567.com
                                </a>
                            </li>
                        </div>
                    </div>
                </div>
            </div>

            {/* 기존 footer */}
            <div className="footer-content">
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
            </div>
            <footer>
                Based on the{' '}
                <a
                    href="https://dribbble.com/shots/6257174-404-Page"
                    target="blank"
                >
                    Dribble
                </a>
                . NOT RESPONSIVE
            </footer>
            {/* </div> */}
        </div>
    );
}
