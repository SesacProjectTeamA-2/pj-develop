import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SummaryCard from './SummaryCard';
import { Divider, List, ListItem, ListItemText, Paper } from '@mui/material';

import '../../styles/scss/pages/management/managementlist.scss';
import REnhancedTable from './REnhancedTable';

export default function Report() {
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

    return (
        <div style={{ margin: '0 0 4rem 7rem' }}>
            <SummaryCard
                allUser={allUserInfo}
                allGroup={allGroup}
                allComplain={allComplain}
            />

            <Paper elevation={3} className="list-paper">
                <div className="title4 list-title">신고 내역</div>
                {/* 신고한 사람, 신고 받은 사람, 사유 */}

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
                    <div>
                        관리자 권한으로, 체크박스를 클릭하면 해당 유저를
                        그룹에서 강제 추방할 수 있습니다.
                    </div>
                </div>
                <br />

                <REnhancedTable />

                {/* <List
                    //  sx={style}
                    component="nav"
                    aria-label="mailbox folders"
                >
                    {allComplain?.map((user: any, idx: number) => {
                        return (
                            <>
                                <ListItem button>
                                    <ListItemText primary={`${user.cSeq}`} />
                                    <ListItemText primary={`${user.uName}`} />
                                    <ListItemText primary={`${user.cDetail}`} />
                                    <ListItemText
                                        primary={`${user.createdAt}`}
                                    />
                                </ListItem>
                                <Divider />
                            </>
                        );
                    })} */}

                {/* <ListItem button>
                        <ListItemText primary="hi" />
                    </ListItem>
                    <Divider light />

                    <ListItem button>
                        <ListItemText primary="Spam" />
                    </ListItem> */}
                {/* </List> */}
            </Paper>
        </div>
    );
}
