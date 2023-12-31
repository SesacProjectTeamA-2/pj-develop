import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { Cookies } from 'react-cookie';

import '../../styles/scss/components/titles.scss';
import '../../styles/scss/components/buttons.scss';
import '../../styles/scss/components/inputs.scss';
import '../../styles/scss/pages/group/groups.scss';

import InterestedList from '../../components/common/InterestedList';
import GroupList from './GroupList';
import GroupSearch from './GroupSearch';
import GroupSearchAll from './GroupSearchAll';
import { useNavigate } from 'react-router-dom';

export default function Groups() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    //] 검색
    const [selectedArr, setSelectedArr] = useState<Array<string>>([]);
    const [search, setSearch] = useState(false);
    const [searchAll, setSearchAll] = useState(false);

    const [searchInput, setSearchInput] = useState('');

    const [searchGroupList, setSearchGroupList] = useState([]);

    const nvg = useNavigate();

    const getSearchGroupList = async () => {
        const res = await axios
            .get(
                // `${process.env.REACT_APP_DB_HOST}/group?search=${searchInput}&category=${selectedArr}`
                `${process.env.REACT_APP_DB_HOST}/group?search=${searchInput}`
            )
            .then((res) => {
                setSearchGroupList(res.data.groupArray);
            });
    };

    const searchHandler = () => {
        if (!uToken) {
            alert('로그인이 필요합니다 !');
            return;
        } else {
            getSearchGroupList();
            setSearch(!search);
        }
    };

    const searchAllHandler = () => {
        if (!uToken) {
            alert('로그인이 필요합니다 !');
            return;
        } else {
            getSearchGroupList();
            setSearchAll(!searchAll);
        }
    };

    // key down event 입력 시
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) {
            return;
        }

        if (event.key === 'Enter') {
            setSearch(true);
        }
    };

    const createHandler = () => {
        if (!uToken) {
            alert('로그인이 필요합니다 !');
            return;
        } else nvg('/group/create');
    };

    return (
        <div className="section">
            <div className="group-container">
                <div className="input-wrapper">
                    <input
                        className="search"
                        type="text"
                        placeholder="어떤 모임을 찾으시나요 ?"
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                        }}
                    />
                    <div className="search-btns">
                        {searchAll ? (
                            <button
                                className="btn-sm"
                                onClick={searchAllHandler}
                            >
                                {searchAll ? '취소' : '전체'}
                            </button>
                        ) : (
                            <>
                                <button
                                    className="btn-sm"
                                    onClick={searchHandler}
                                >
                                    {search ? '취소' : '검색'}
                                </button>{' '}
                                <button
                                    className="btn-sm"
                                    onClick={searchAllHandler}
                                >
                                    {searchAll ? '취소' : '전체'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 관심분야 검색 */}
                <div className="groups-interested">
                    {/* <InterestedList
                        selectedArr={selectedArr}
                        setSelectedArr={setSelectedArr}
                    /> */}
                </div>

                {searchAll ? (
                    <GroupSearchAll
                        searchInput={searchInput}
                        selectedArr={selectedArr}
                    />
                ) : search ? (
                    <GroupSearch
                        searchInput={searchInput}
                        selectedArr={selectedArr}
                    />
                ) : (
                    <GroupList />
                )}
            </div>
            <div className="btn-fixed-wrapper">
                {/* <button className="btn-fixed" onClick={createHandler}> */}
                {/* <button className="btn-fixed-floating" onClick={createHandler}>
                    내가 모임 만들기 !
                </button> */}
                <button className="btn-fixed-rl" onClick={createHandler}>
                    <span className="shadow">
                        <span className="vert">
                            <span className="floating">
                                <span className="front">
                                    원하는 모임이 없나요 ?
                                </span>
                                <span className="back">직접 만들러 가요 !</span>
                            </span>
                        </span>
                    </span>
                </button>
                {/* <span className="btn-fixed-floating-shadow"></span> */}
            </div>
        </div>
    );
}
