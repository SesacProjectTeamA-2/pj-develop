import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import '../../styles/scss/pages/group/groupNoti.scss';

import GroupHeader from '../../components/group/content/GroupHeader';
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

//=== 테이블 정의
interface Column {
    id: 'id' | 'title' | 'content' | 'writer' | 'date';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'No.', minWidth: 10 },
    { id: 'title', label: '제목', minWidth: 50, align: 'center' },
    { id: 'content', label: '내용', minWidth: 100, align: 'center' },
    {
        id: 'writer',
        label: '작성자',
        minWidth: 30,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'date',
        label: '작성날짜',
        minWidth: 30,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface Data {
    id: string;
    title: string;
    content: string;
    writer: string;
    date: string;
}

function createData(
    id: string,
    title: string,
    content: string,
    writer: string,
    date: string
): Data {
    return { id, title, content, writer, date };
}

export default function GroupNoti() {
    const { gSeq, gCategory } = useParams();

    console.log(gSeq, gCategory);

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

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

    //] 1. 공지 조회
    const getBoardNoti = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/board/${gSeq}/notice`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setNoticeList(res.data.groupInfo);

                // setCommentList(res.data.groupInfo.tb_groupBoardCommnets);

                const newNoticeList = res.data.groupInfo;
                setNoticeList(newNoticeList);

                const newGbSeqList = newNoticeList?.map(
                    (item: any) => item.gbSeq
                );
                setGbSeqList(newGbSeqList);
            });
    };

    useEffect(() => {
        getBoardNoti();
    }, []);

    const [noticeList, setNoticeList] = useState<any>([]);

    console.log('noticeList', noticeList);

    const [gbSeqList, setGbSeqList] = useState<any>([]);

    console.log('gbSeqList', gbSeqList);

    const reversedRows = noticeList?.map((item: any, index: number) =>
        createData(
            String(index + 1),
            // replace(/(<([^>]+)>)/gi, '') => html tag 처리
            item.gbTitle.replace(/(<([^>]+)>)/gi, ''),
            item.gbContent.replace(/(<([^>]+)>)/gi, ''),

            item.tb_groupUser.tb_user.uName.replace(/(<([^>]+)>)/gi, ''), // [추후] 작성자 닉네임 추가

            item.createdAt
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

    return (
        <div className="section section-group">
            <GroupHeader title={'공지사항'} groupName={gName} />
            <p className="noti-info">공지사항은 모임장만 작성 가능합니다.</p>

            {/* html tag 처리 */}
            {/* noticeList.map((notice:any)=>{
                return(
                    <div key={notice.gbSeq}>
                        <div dangerouslySetInnerHTML={{__html:notice.gbContent}}/>
                        
                    </div>
                )
            }) */}
            <div className="noti-container">
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
                                                minWidth: column.minWidth,
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody style={{ cursor: 'pointer' }}>
                                {rows
                                    ?.slice(
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
                                                {columns?.map((column) => {
                                                    const value =
                                                        row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                        >
                                                            <Link
                                                                // to={`/board/${gSeq}/notice/${gbSeq}`}
                                                                to={`/board/${gSeq}/notice/${gbSeqList[idx]}`}
                                                            >
                                                                {column.format &&
                                                                typeof value ===
                                                                    'number'
                                                                    ? column.format(
                                                                          value
                                                                      )
                                                                    : value}
                                                            </Link>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>

            {isLeader ? (
                <div className="plus-fixed-wrapper">
                    <span className="plus-text">
                        공지사항 <br />
                        작성하기 !
                    </span>
                    <Link to={`/board/create/${gSeq}/${gCategory}`}>
                        <img
                            src="/asset/icons/plus.svg"
                            className="plus-fixed"
                            alt="plus-fixed"
                        />
                    </Link>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}
