import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import '../../styles/scss/pages/group/groupPostList.scss';

import GroupHeader from '../../components/group/content/GroupHeader';
import GroupContent from '../../components/group/content/GroupContentList';

export default function GroupBoard() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq, gCategory } = useParams();

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);

                setGName(res.data.groupName);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    const [gName, setGName] = useState('');

    return (
        <div className="section section-group">
            <GroupHeader title={'자유/질문'} groupName={gName} />
            <GroupContent action={'자유/질문'} />
            <div className="plus-fixed-wrapper">
                <span className="plus-text">
                    자유/질문
                    <br />
                    작성하기 !
                </span>

                <Link to={`/board/create/${gSeq}/free`}>
                    <img
                        src="/asset/icons/plus.svg"
                        className="plus-fixed"
                        alt="plus-fixed"
                    />
                </Link>
            </div>
        </div>
    );
}
