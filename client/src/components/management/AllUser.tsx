import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SummaryCard from './SummaryCard';
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

import '../../styles/scss/pages/management/managementlist.scss';
import MEnhancedTable from './MEnhancedTable';

export default function AllUser() {
    const [allUser, setAllUser] = useState<any>();
    const [allUserInfo, setAllUserInfo] = useState<any>();
    const [allJoinInfo, setAllJoinInfo] = useState<any>();

    const getAllUser = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/users`)
            .then((res) => {
                console.log('getAllUser', res.data);
                setAllUser(res.data);
                setAllUserInfo(res.data.allUser);
                setAllJoinInfo(res.data.joinGroup);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllUser();
    }, []);

    console.log('allUser >>>', allUser);
    console.log('allUserInfo >>>', allUserInfo);
    console.log('allJoinInfo >>>', allJoinInfo);

    //; List의 스타일
    const style = {};

    return (
        <div style={{ margin: '0 0 4rem 7rem' }}>
            <SummaryCard allUser={allUserInfo} />
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
                        관리자 권한으로, 체크박스를 클릭하면 회원을 강제
                        탈퇴시킬 수 있습니다.
                    </div>
                </div>
                <br />

                {/* === filtered table === */}
                <MEnhancedTable />

                {/* === sticky table === */}
                {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                            <TableBody>
                                {rows
                                    ?.slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row: any) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                            >
                                                {columns.map((column) => {
                                                    const value =
                                                        row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                        >
                                                            {value}
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
                </Paper> */}

                {/* <List sx={style} component="nav" aria-label="mailbox folders">
                    {allUserInfo?.map((user: any, idx: number) => {
                        return (
                            <>
                                <ListItem button>
                                    <ListItemText primary={`${user.uSeq}`} />
                                    <ListItemText primary={`${user.uName}`} />
                                    <ListItemText
                                        primary={`${user.createdAt}`}
                                    />
                                </ListItem>
                                <Divider />
                            </>
                        );
                    })}

                    <ListItem button>
                        <ListItemText primary="hi" />
                    </ListItem>
                    <Divider light />

                    <ListItem button>
                        <ListItemText primary="Spam" />
                    </ListItem>
                </List> */}
            </Paper>
        </div>
    );
}
