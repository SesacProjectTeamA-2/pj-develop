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
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';
import { PolarArea, Line, Bar, Pie } from 'react-chartjs-2';
import { Paper } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
);

export default function Management() {
    const [allUser, setAllUser] = useState<any>();
    const [allGroup, setAllGroup] = useState<any>();
    const [allComplain, setAllComplain] = useState<any>();
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
    const [allUserDate, setAllUserDate] = useState<any>();
    const [allGroupDate, setAllGroupDate] = useState<any>();
    const [gSeqCountArray, setGSeqCountArray] = useState<any>();
    // [[gSeq, gName, 유저수]]
    // [[1, "모임명1", 2], [2, "모임명2", 5], ...]

    //] 전체 유저 GET
    const getAllUser = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/users`)
            .then((res) => {
                console.log('getAllUser', res.data);

                setAllUser(res.data.allUser);

                //; 1. 회원 가입날짜 카운트
                const groupedUserDate = res.data.allUser?.reduce(
                    (acc: any, item: any) => {
                        const date = item.createdAt.split(' ')[0]; // "2023-12-24"
                        acc[date] = (acc[date] || 0) + 1;
                        return acc;
                    },
                    {}
                );

                //-- 누적 값으로 변환
                const cumulativeUserDateData: any = {};
                let cumulativeUserDateCount = 0;

                for (const date in groupedUserDate) {
                    cumulativeUserDateCount += groupedUserDate[date];
                    cumulativeUserDateData[date] = cumulativeUserDateCount;
                }

                setAllUserDate(cumulativeUserDateData);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    //] 전체 모임 GET
    const getAllGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/groups`)
            .then((res) => {
                console.log('getAllGroup', res.data);
                setAllGroup(res.data.allGroup);

                //; 1. 그룹 생성날짜 카운트
                const groupedData = res.data.allGroup?.reduce(
                    (acc: any, item: any) => {
                        const date = item.createdAt.split(' ')[0]; // "2023-12-24"
                        acc[date] = (acc[date] || 0) + 1;
                        return acc;
                    },
                    {}
                );

                //-- 누적 값으로 변환
                const cumulativeData: any = {};
                let cumulativeCount = 0;

                for (const date in groupedData) {
                    cumulativeCount += groupedData[date];
                    cumulativeData[date] = cumulativeCount;
                }
                // console.log('groupedData>>>>>', groupedData);

                setAllGroupDate(cumulativeData);

                //; 2. 그룹 카테고리별 카운트
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

                //; 3. 그룹 인원수 카운트
                const gSeqCount: any = [];
                //-- gSeq 세팅
                for (let i = 0; i < res.data.allGroup?.length; i++) {
                    gSeqCount.push([
                        res.data.allGroup[i].gSeq,
                        res.data.allGroup[i].gName,
                        0,
                    ]);
                }

                console.log('gSeqCount 세팅 >>>>>', gSeqCount);

                for (let i = 0; i < res.data.groupUserArray?.length; i++) {
                    for (let j = 0; j < gSeqCount.length; j++) {
                        if (
                            gSeqCount[j][0] === res.data.groupUserArray[i].gSeq
                        ) {
                            gSeqCount[j][2] += 1;
                        }
                    }
                }

                setGSeqCountArray(gSeqCount);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    //] 신고 GET
    const getAllComplain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/complain`)
            .then((res) => {
                console.log('getAllComplain', res.data);
                setAllComplain(res.data.result);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllUser();
        getAllGroup();
        getAllComplain();
    }, []);

    console.log('allUser >>>', allUser);
    console.log('allGroup >>>', allGroup);
    // console.log('gCategoryCount >>>', gCategoryCount);
    // console.log('groupedDcumulativeCountata>>>>>', allGroupDate);
    // console.log('groupedDcumulativeCountata>>>>>', allUserDate);
    // console.log('setGSeqCountArray>>>>>', gSeqCountArray);
    // console.log('setGSeqCountArray>>>>>', [
    //     ...gSeqCountArray?.map((item: any) => item[2]),
    // ]);

    //] Line Chart
    //; 1. 가입한 유저 수
    const userDateOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const userDateLabels = allUserDate ? [...Object.keys(allUserDate)] : [];

    const userDateData = {
        labels: userDateLabels,
        datasets: [
            {
                label: '인원',
                data: allUserDate ? Object.values(allUserDate) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    //; 2. 생성된 모임 수
    const groupDateOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            // title: {
            //     display: true,
            //     text: '날짜별 생성된 그룹',
            // },
        },
    };

    const groupDateLabels = allGroupDate ? [...Object.keys(allGroupDate)] : [];

    const groupDateData = {
        labels: groupDateLabels,
        datasets: [
            {
                label: '그룹 개수',
                data: allGroupDate ? Object.values(allGroupDate) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    //] Area Chart
    //; 3. 그룹별 카테고리 수
    const areaData = {
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

    //; 4. 그룹별 참가인원 수

    const pieData = {
        labels: gSeqCountArray
            ? [...gSeqCountArray?.map((item: any) => item[1])]
            : [],
        datasets: [
            {
                label: '참가 인원',
                data: gSeqCountArray
                    ? [...gSeqCountArray?.map((item: any) => item[2])]
                    : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(140, 182, 56, 0.5)',
                    'rgba(56, 67, 182, 0.5)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                display: false, // 레전드를 감춤 (label 그룹명 너무 많아질 경우, 복잡해보일 수도 있기 때문)
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        // 호버할 때 레이블 표시
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h1>Welcome to DashBoard</h1>
            <SummaryCard
                allUser={allUser}
                allGroup={allGroup}
                allComplain={allComplain}
            />
            {/* 그래프 */}
            <div className="paper-graph-container">
                <Paper elevation={3}>
                    <h2>User</h2>
                    <h4>가입한 회원 수</h4>
                    <div className="group-line-graph-container">
                        <Bar options={userDateOptions} data={userDateData} />
                    </div>
                </Paper>
            </div>
            <div className="paper-graph-container">
                <Paper elevation={3}>
                    <h2>Group</h2>
                    <h4>생성된 그룹 수</h4>
                    <div className="group-line-graph-container">
                        <Line options={groupDateOptions} data={groupDateData} />
                    </div>
                    <h4>Category</h4>
                    <div className="graph-container">
                        <PolarArea data={areaData} />
                    </div>
                    <h4 style={{ marginTop: '6rem' }}>그룹별 참가 인원</h4>
                    <div
                        className="graph-container"
                        style={{ paddingBottom: '4rem' }}
                    >
                        {allGroup?.length > 0 ? (
                            <Pie data={pieData} options={pieOptions} />
                        ) : (
                            <div>그룹에 참가한 인원이 없습니다. </div>
                        )}
                    </div>
                </Paper>
                <br />
            </div>
        </div>
    );
}
