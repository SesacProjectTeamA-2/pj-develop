import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

import '../../styles/scss/pages/group/groupMissionDone.scss';

import GroupContent from '../../components/group/content/GroupContentList';
import GroupHeader from '../../components/group/content/GroupHeader';
import { GroupMission, MissionType } from 'src/types/types';
import useDateChange from 'src/hooks/useDateChange';

//=== 테이블 정의
interface Column {
    id: 'id' | 'title' | 'startDate' | 'doneDate';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'No.', minWidth: 50 },
    { id: 'title', label: '미션명', minWidth: 150, align: 'center' },
    { id: 'startDate', label: '시작 날짜', minWidth: 80, align: 'center' },
    {
        id: 'doneDate',
        label: '완료 날짜',
        minWidth: 80,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    // {
    //     id: 'startDate',
    //     label: '작성날짜',
    //     minWidth: 80,
    //     align: 'center',
    //     format: (value: number) => value.toLocaleString('en-US'),
    // },
    // {
    //     id: 'density',
    //     label: 'Density',
    //     minWidth: 170,
    //     align: 'right',
    //     format: (value: number) => value.toFixed(2),
    // },
];

interface Data {
    id: string;
    title: string;
    startDate: string;
    doneDate: string;
}

function createData(
    id: string,
    title: string,
    startDate: string,
    doneDate: string
): Data {
    // const density = doneDate / startDate;
    return { id, title, startDate, doneDate };
}

export default function GroupMissionDone() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    //=== 모임 상세화면 읽어오기 ===

    const { gSeq } = useParams();

    const [groupMission, setGroupMission] = useState<GroupMission>({
        uEmail: '',
        uName: '',
        gName: '',
        Dday: 0,
        uSeq: 0,
        missionList: [],
        expiredMissionList: [],
    });

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/mission/group/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setGroupMission(res.data);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    //=== 데이터가 들어올 부분 ===
    const reversedRows = groupMission.expiredMissionList.map(
        (item: any, index: number) =>
            createData(
                // String(noticeList.length - index),
                String(index + 1),
                // replace(/(<([^>]+)>)/gi, '') => html tag 처리
                item.mTitle,
                item.createdYear +
                    '-' +
                    item.createdMonth +
                    '-' +
                    item.createdDay,
                item.updatedYear +
                    '-' +
                    item.updatedMonth +
                    '-' +
                    item.updatedDay
                // item.createdAt
            )
    );

    const rows = reversedRows;

    // 페이지 이동
    const navigate = useNavigate();

    // const handleRowClick = (rowId: number) => {
    //     navigate('/group/idti/1/' + rowId);
    // };

    // 테이블
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    console.log('>>>>>>>>>>>', groupMission.expiredMissionList);

    return (
        <div className="section section-group">
            <GroupHeader title={'완료된 미션'} groupName={groupMission.gName} />
            <div className="noti-container">
                <div className="noti-header mission-done-header">
                    <div
                        className="noti-container-done"
                        style={{ width: '100%' }}
                    >
                        <Paper sx={{ width: '100%' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{
                                                        minWidth:
                                                            column.minWidth,
                                                    }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody style={{ cursor: 'pointer' }}>
                                        {rows
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row: any, idx: number) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        key={row.title}
                                                    >
                                                        {columns.map(
                                                            (column) => {
                                                                const value =
                                                                    row[
                                                                        column
                                                                            .id
                                                                    ];
                                                                return (
                                                                    <TableCell
                                                                        key={
                                                                            column.id
                                                                        }
                                                                        align={
                                                                            column.align
                                                                        }
                                                                    >
                                                                        {/* <Link
                                                                            to={`/board/${gSeq}/notice/${gbSeqList[idx]}`}
                                                                        > */}
                                                                        {column.format &&
                                                                        typeof value ===
                                                                            'number'
                                                                            ? column.format(
                                                                                  value
                                                                              )
                                                                            : value}
                                                                        {/* </Link> */}
                                                                    </TableCell>
                                                                );
                                                            }
                                                        )}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    );
}
