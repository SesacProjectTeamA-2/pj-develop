import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { GroupStateType } from 'src/types/types';
import { Link } from 'react-router-dom';

import { Paper } from '@mui/material';

export default function GroupSearchAll({
    searchInput,
    selectedArr,
    memberCount,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [allGroupList, setAllGroupList] = useState<any>([]);
    const [allGroupMember, setAllGroupMember] = useState<any>([]);

    //-- 움직이는 효과
    useEffect(() => {
        const cards = document.querySelectorAll('.glow-card-container');

        cards.forEach((card) => {
            const overlay = card.querySelector(
                '.glow-card-overlay'
            ) as HTMLElement;

            card.addEventListener('mouseover', function () {
                overlay.style.filter = 'opacity(1)';
            });

            card.addEventListener('mouseout', function () {
                overlay.style.filter = 'opacity(0)';

                (
                    card as HTMLElement
                ).style.transform = `perspective(350px) rotateX(0deg) rotateY(0deg)`;
            });

            card.addEventListener('mousemove', function (e: any) {
                const x = e.offsetX;
                const y = e.offsetY;
                const rotateY = (-1 / 5) * x + 20;
                const rotateX = (4 / 30) * y - 20;

                overlay.style.backgroundPosition = `${x / 5 + y / 5}%`;
                overlay.style.filter = `opacity(${x / 200}) brightness(1.2)`;

                (
                    card as HTMLElement
                ).style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });
    }, []);

    //-- 전체 검색
    useEffect(() => {
        const getSearchGroupList = async () => {
            const res = await axios.get(
                // 전체 검색
                `${process.env.REACT_APP_DB_HOST}/group?search=%`
            );

            console.log('검색결과', res.data);
            console.log(res);
            setAllGroupList(res.data.groupArray);
            setAllGroupMember(res.data.groupMember);
        };

        getSearchGroupList();
    }, [searchInput, selectedArr]);

    let categories: any = [];
    let countArray: any = [];

    for (let i = 0; i < allGroupList?.length; i++) {
        switch (allGroupList[i].gCategory) {
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

    // 현재 참석 멤버수
    for (let i = 0; i < allGroupMember?.length; i++) {
        countArray.push(allGroupMember[i].count);
    }

    return (
        <div>
            <div className="title3" style={{ marginBottom: '2rem' }}>
                전체 모임
            </div>

            <div className="search-group-grid">
                {!allGroupList || allGroupList?.length === 0
                    ? '생성된 모임이 없습니다.'
                    : allGroupList?.map(
                          (searchGroup: GroupStateType, idx: number) => (
                              <div
                                  key={searchGroup.gSeq}
                                  className="search-group-container"
                              >
                                  <Link to={`/group/home/${searchGroup.gSeq}`}>
                                      <ul className="search-card">
                                          <li>
                                              <h2> {categories[idx]}</h2>
                                          </li>

                                          <li className="title-card">
                                              {searchGroup.gName}
                                          </li>

                                          <li className="group-search-dday-text">
                                              {/* <span>D-Day</span> */}
                                              <svg
                                                  viewBox="0 0 24 24"
                                                  fill="currentColor"
                                                  height="1.4em"
                                                  width="1.4em"
                                              >
                                                  <path d="M7 10h5v5H7m12 4H5V8h14m0-5h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
                                              </svg>
                                              {searchGroup.gDday}
                                          </li>
                                          <li className="attend-member-count">
                                              {/* <i
                                                  className="fa fa-check"
                                                  aria-hidden="true"
                                              ></i> */}
                                              참석 인원&nbsp;
                                              <b>
                                                  {countArray[idx]}&nbsp;/&nbsp;
                                                  {searchGroup.gMaxMem}
                                              </b>
                                          </li>

                                          {searchGroup.gMaxMem -
                                              countArray[idx] >
                                          0 ? (
                                              <button className="all-group-serach-join-btn">
                                                  참석 가능
                                              </button>
                                          ) : (
                                              <button className="all-group-serach-join-done-btn">
                                                  마감
                                              </button>
                                          )}
                                      </ul>
                                  </Link>
                              </div>
                          )
                      )}
            </div>

            {/* 반짝이는 효과 */}
            {/* <div className="search-group-grid">
                {!allGroupList || allGroupList?.length === 0
                    ? '생성된 모임이 없습니다.'
                    : allGroupList?.map(
                          (searchGroup: GroupStateType, idx: number) => (
                              <div
                                  key={searchGroup.gSeq}
                                  className="glow-card-container"
                              >
                                  <Link to={`/group/home/${searchGroup.gSeq}`}>
                                      <div className="glow-card-overlay"></div>
                                      <ul className="glow-card">
                                          <li>
                                              <h2> {categories[idx]}</h2>
                                          </li>

                                          <li className="title-card">
                                              {searchGroup.gName}
                                          </li>

                                          <li className="group-search-dday-text">
                                              <span>D-Day</span>
                                              {searchGroup.gDday}
                                          </li>
                                          <li>
                                              <i
                                                  className="fa fa-check"
                                                  aria-hidden="true"
                                              ></i>
                                              참석인원
                                              {countArray[idx]}/
                                              {searchGroup.gMaxMem}
                                          </li>

                                          {searchGroup.gMaxMem -
                                              countArray[idx] >
                                          0 ? (
                                              <button className="all-group-serach-join-btn">
                                                  참석 가능
                                              </button>
                                          ) : (
                                              <button className="all-group-serach-join-done-btn">
                                                  마감
                                              </button>
                                          )}
                                      </ul>
                                  </Link>
                              </div>
                          )
                      )}
            </div> */}
        </div>
    );
}
