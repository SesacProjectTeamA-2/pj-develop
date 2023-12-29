import React, { useEffect } from 'react';
import axios from 'axios';

import SummaryCard from './SummaryCard';
import { Divider, List, ListItem, ListItemText, Paper } from '@mui/material';

import '../../styles/scss/pages/management/managementlist.scss';

export default function AllUser() {
    // List의 스타일
    const style = {};

    return (
        <div>
            <SummaryCard />
            <Paper elevation={3} className="list-paper">
                <div className="title4 list-title">전체 유저</div>
                <List sx={style} component="nav" aria-label="mailbox folders">
                    <ListItem button>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <Divider />
                    <ListItem button divider>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Trash" />
                    </ListItem>
                    <Divider light />
                    <ListItem button>
                        <ListItemText primary="Spam" />
                    </ListItem>
                </List>
            </Paper>
        </div>
    );
}
