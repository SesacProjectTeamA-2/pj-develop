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
            </Paper>
        </div>
    );
}
