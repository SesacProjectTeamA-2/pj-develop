import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { GroupStateType } from 'src/types/types';
import { Link } from 'react-router-dom';

export default function GroupSearch({
    searchInput,
    selectedArr,
    categoryQuery,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [searchGroupList, setSearchGroupList] = useState<any>();
    const [allGroupMember, setAllGroupMember] = useState<any>([]);

    console.log(selectedArr);

    let categories: any = [];
    let countArray: any = [];

    useEffect(() => {
        const getSearchGroupList = async () => {
            const res = await axios.get(
                // 임시로 전체 검색
                `${process.env.REACT_APP_DB_HOST}/group?search=${searchInput}&category=${selectedArr}`
            );

            console.log('검색결과', res.data);
            setSearchGroupList(res.data.groupArray);
            setAllGroupMember(res.data.groupMember);
        };

        getSearchGroupList();
    }, [searchInput, selectedArr]);

    console.log('searchGroupList', searchGroupList);

    for (let i = 0; i < searchGroupList?.length; i++) {
        switch (searchGroupList[i].gCategory) {
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

    console.log(allGroupMember, countArray);

    return (
        <div>
            <div className="title4" style={{ marginBottom: '2rem' }}>
                검색 결과
            </div>

            <div className="search-group-grid">
                {!searchGroupList ||
                searchGroupList?.length === 0 ||
                searchGroupList == undefined
                    ? '검색 결과가 없습니다.'
                    : searchGroupList?.map(
                          (searchGroup: GroupStateType, idx: number) => (
                              <div
                                  key={searchGroup.gSeq}
                                  className="search-group-container"
                              >
                                  <Link to={`/group/home/${searchGroup.gSeq}`}>
                                      <ul className="search-card">
                                          <li>
                                              <h1> {categories[idx]}</h1>
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

                                      {/* <div className="title-card">
                                      {searchGroup.gName}
                                  </div>
                                  <br />
                                  <span
                                      style={{
                                          // margin: '0px 15px',
                                          color: '#8D6262',
                                          //   fontWeight: 'bold',
                                          //   fontSize: '1.2rem',
                                      }}
                                  >
                                      <span className="title5">D-day</span>
                                  </span>
                                  <div className="title6">
                                      {searchGroup.gDday}
                                  </div> */}
                                  </Link>
                              </div>
                          )
                      )}
            </div>
        </div>
    );
}
