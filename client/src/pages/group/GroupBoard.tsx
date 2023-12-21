import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';

import '../../styles/scss/pages/group/groupPostList.scss';

import GroupHeader from '../../components/group/content/GroupHeader';
import GroupContent from '../../components/group/content/GroupContentList';
import { Fab } from '@mui/material';

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

    //] post 버튼 스크롤에 따라 효과

    //~ [추후] 수정 !
    useEffect(() => {
        document.addEventListener('scroll', function () {
            var moonIcon = document.querySelector('.moon-icon');
            var scrollPosition = window.scrollY;
            var documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            var scrollRatio = scrollPosition / documentHeight;

            // 비율에 따라서 달이 나타나거나 사라지도록 설정
            if (scrollRatio < 0.6) {
                moonIcon?.classList.add('show');
            } else if (scrollRatio < 0.8) {
                moonIcon?.classList.remove('show');
                moonIcon?.classList.add('show-md');
            } else {
                moonIcon?.classList.remove('show');
            }
        });
    });

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
                    {/* <img
                        src="/asset/icons/plus.svg"
                        className="plus-fixed"
                        alt="plus-fixed"
                    /> */}
                    {/* <Fab color="secondary" aria-label="edit">
                        <EditIcon />
                    </Fab> */}

                    <div className="moon-icon"></div>
                </Link>
            </div>
        </div>
    );
}
