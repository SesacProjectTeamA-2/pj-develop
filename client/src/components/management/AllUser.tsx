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
    const [allGroup, setAllGroup] = useState();
    const [allComplain, setAllComplain] = useState<any>();

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

    const getAllGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/groups`)
            .then((res) => {
                console.log('getAllGroup', res.data);
                setAllGroup(res.data.allGroup);
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
    console.log('allUserInfo >>>', allUserInfo);
    console.log('allJoinInfo >>>', allJoinInfo);

    //; List의 스타일
    const style = {};

    return (
        <div style={{ margin: '0 0 4rem 7rem' }}>
            <SummaryCard
                allUser={allUserInfo}
                allGroup={allGroup}
                allComplain={allComplain}
            />
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
                        <strong>[ CAUTION ]</strong>
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
