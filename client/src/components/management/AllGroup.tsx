import React, { useEffect } from 'react';
import axios from 'axios';

import SummaryCard from './SummaryCard';
import { Paper } from '@mui/material';

import '../../styles/scss/pages/management/managementlist.scss';

export default function AllGroup() {
    return (
        <div>
            <SummaryCard />
            <Paper elevation={3} className="list-paper">
                <div className="title4 list-title">전체 그룹</div>
            </Paper>
        </div>
    );
}
