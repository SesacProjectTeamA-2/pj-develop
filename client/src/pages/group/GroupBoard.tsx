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

    console.log('gSeq', gSeq);

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
                setIsLeader(res.data.isLeader);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    const [gName, setGName] = useState('');
    const [isLeader, setIsLeader] = useState(false);

    //] post 버튼 스크롤에 따라 효과
    useEffect(() => {
        function handleScroll() {
            var moonIcon = document.querySelector('.moon-icon');
            var scrollPosition = window.scrollY;
            var documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            var scrollRatio = scrollPosition / documentHeight;

            if (scrollRatio < 0.8) {
                moonIcon?.classList.remove('show-md');
                moonIcon?.classList.add('show');
                moonIcon?.classList.remove('hide');
            } else if (scrollRatio < 0.9) {
                moonIcon?.classList.remove('show');
                moonIcon?.classList.add('show-md');
                moonIcon?.classList.remove('hide');
            } else {
                moonIcon?.classList.remove('show');
                moonIcon?.classList.remove('show-md');
                moonIcon?.classList.add('hide');
            }
        }

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="section section-group">
            <div className="moon-wrapper">
                <GroupHeader title={'자유/질문'} groupName={gName} />
                <GroupContent action={'자유/질문'} />
                {/* <div className="plus-fixed-wrapper">
                <span className="plus-text">
                    자유/질문
                    <br />
                    작성하기 !
                </span>
            </div> */}

                <div className="moon-icon-wrapper">
                    <Link to={`/board/create/${gSeq}/free`}>
                        {/* <img
                        src="/asset/icons/plus.svg"
                        className="plus-fixed"
                        alt="plus-fixed"
                    /> */}
                        {/* <Fab color="secondary" aria-label="edit">
                        <EditIcon />
                    </Fab> */}

                        <div
                            className={
                                isLeader
                                    ? 'moon-icon moon-leader'
                                    : 'moon-icon moon-member'
                            }
                            style={
                                isLeader
                                    ? {
                                          background:
                                              'linear-gradient(-45deg, #a9a378, #ffd100)',
                                      }
                                    : {
                                          background:
                                              'linear-gradient(8deg, #bdb1b1, #ffc1c7)',
                                      }
                            }
                        ></div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
