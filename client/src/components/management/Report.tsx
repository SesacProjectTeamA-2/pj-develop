import React from 'react';

import SummaryCard from './SummaryCard';
import { Paper } from '@mui/material';

import '../../styles/scss/pages/management/managementlist.scss';

export default function Report() {
    return (
        <div>
            <SummaryCard />
            <Paper elevation={3} className="list-paper">
                <div className="title4 list-title">신고 내역</div>
                {/* 신고한 사람, 신고 받은 사람, 사유 */}

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
