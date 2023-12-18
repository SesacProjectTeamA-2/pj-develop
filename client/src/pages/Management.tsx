import React from 'react';
import AllUser from '../components/management/AllUser';
import AllGroup from '../components/management/AllGroup';
import Report from '../components/management/Report';
import SummaryCard from '../components/management/SummaryCard';

export default function Management() {
    return (
        <div className="section">
            <Report />
            <AllUser />
            <AllGroup />
        </div>
    );
}
