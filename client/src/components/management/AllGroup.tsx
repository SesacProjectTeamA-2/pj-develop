import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SummaryCard from './SummaryCard';
import { Paper } from '@mui/material';

import '../../styles/scss/pages/management/managementlist.scss';
import GEnhancedTable from './GEnhancedTable';

export default function AllGroup() {
    const [allUser, setAllUser] = useState();
    const [allGroup, setAllGroup] = useState();
    const [gCategoryCount, setGCategoryCount] = useState<any>([
        { ex: 0 },
        { re: 0 },
        { lan: 0 },
        { cert: 0 },
        { st: 0 },
        { eco: 0 },
        { it: 0 },
        { etc: 0 },
    ]);

    const getAllUser = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/users`)
            .then((res) => {
                console.log('getAllUser', res.data);

                setAllUser(res.data.allUser);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    const getAllGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/groups`)
            .then((res) => {
                console.log('getAllGroup', res.data);
                setAllGroup(res.data.allGroup);

                const updatedItem: any = [...gCategoryCount];
                res.data.allGroup.forEach((item: any) => {
                    const category = item.gCategory;

                    // gCategoryCount 배열에서 해당 카테고리 키를 찾아 +1 증가
                    setGCategoryCount((prevCounts: any) => {
                        return prevCounts.map(
                            (countItem: Record<string, number>) => {
                                const key = Object.keys(countItem)[0];
                                if (key === category) {
                                    return { [key]: countItem[key] + 1 };
                                }
                                return countItem;
                            }
                        );
                    });
                });
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllUser();
        getAllGroup();
    }, []);

    console.log('allUser >>>', allUser);
    console.log('allGroup >>>', allGroup);
    console.log('gCategoryCount >>>', gCategoryCount);

    return (
        <div style={{ margin: '0 0 4rem 7rem' }}>
            <SummaryCard />
            <Paper elevation={3} className="list-paper">
                {/* <div className="title4 list-title">전체 유저</div> */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.3rem',
                    }}
                >
                    <div>
                        <strong>[참고 사항]</strong>
                    </div>
                    <div> 포트폴리오용이므로 개인정보는 제외했습니다.</div>
                    <div>
                        관리자 권한으로, 체크박스를 클릭하면 유저를 삭제할 수
                        있습니다.
                    </div>
                </div>
                <br />

                {/* === filtered table === */}
                <GEnhancedTable />
            </Paper>
        </div>
    );
}
