import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SummaryCard from '../components/management/SummaryCard';
import AllUser from '../components/management/AllUser';
import AllGroup from '../components/management/AllGroup';
import Report from '../components/management/Report';

import '../styles/scss/pages/management/managementlist.scss';

import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { Paper } from '@mui/material';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function Management() {
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

    const data = {
        labels: [
            '운동',
            '독서',
            '언어',
            '자격증',
            '스터디',
            '경제',
            'IT',
            '기타',
        ],
        datasets: [
            {
                label: 'Category',
                data: [
                    gCategoryCount[0].ex,
                    gCategoryCount[1].re,
                    gCategoryCount[2].lan,
                    gCategoryCount[3].cert,
                    gCategoryCount[4].st,
                    gCategoryCount[5].eco,
                    gCategoryCount[6].it,
                    gCategoryCount[7].etc,
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(140, 182, 56, 0.5)',
                    'rgba(56, 67, 182, 0.5)',

                    // 'rgba(201, 203, 207. 0.5)',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div>
            <h1>Welcome to DashBoard</h1>
            <SummaryCard allUser={allUser} allGroup={allGroup} />
            {/* 그래프 */}
            <div className="paper-graph-container">
                <Paper elevation={3}>
                    <h2>Group</h2>
                    <div className="graph-container">
                        <PolarArea data={data} />
                    </div>
                </Paper>
                <br />
                <Paper elevation={3}>
                    <h2>Member</h2>
                    <div className="graph-container">
                        <PolarArea data={data} />
                    </div>
                </Paper>
            </div>
        </div>
    );
}
