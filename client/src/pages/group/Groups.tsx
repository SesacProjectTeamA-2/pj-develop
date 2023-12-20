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

export default function Groups() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    //] 검색
    const [selectedArr, setSelectedArr] = useState<Array<string>>([]);
    const [search, setSearch] = useState(false);
    const [searchAll, setSearchAll] = useState(false);

    const [searchInput, setSearchInput] = useState('');

    const [searchGroupList, setSearchGroupList] = useState([]);

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
        </div>
    );
}
