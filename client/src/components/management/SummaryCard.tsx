import React from 'react';
import axios from 'axios';

import Paper from '@mui/material/Paper';

import '../../styles/scss/pages/management/summarycard.scss';

export default function SummaryCard({ allUser, allGroup }: any) {
    return (
        <div className="summary-card-layout">
            <Paper elevation={3} className="summary-paper">
                <div className="user-icon">
                    <svg
                        viewBox="0 0 512 512"
                        fill="#9e9285"
                        height="2em"
                        width="2em"
                    >
                        <path d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z" />
                    </svg>
                </div>
                <div className="summary-title-content">
                    <div className="title5">{allUser?.length}</div>
                    <div className="summary-title">Users</div>
                </div>
            </Paper>
            <Paper elevation={3} className="summary-paper">
                <div className="user-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="#9e9285"
                        height="2.5em"
                        width="2.5em"
                    >
                        <path d="M21 18.28v-6.56A2 2 0 1018.28 9H15V5.72A2 2 0 1012.28 3H5.72A2 2 0 103 5.72v6.56A2 2 0 105.72 15H9v3.28A2 2 0 1011.72 21h6.56A2 2 0 1021 18.28zM8 10a2 2 0 001 1.72V13H5.72a1.91 1.91 0 00-.72-.72V5.72A1.91 1.91 0 005.72 5h6.56a1.91 1.91 0 00.72.72V9h-1.28A2 2 0 008 10zm5 1v1.28a1.91 1.91 0 00-.72.72H11v-1.28a1.91 1.91 0 00.72-.72zm6 7.28a1.91 1.91 0 00-.72.72h-6.56a1.91 1.91 0 00-.72-.72V15h1.28A2 2 0 1015 12.28V11h3.28a1.91 1.91 0 00.72.72z" />
                    </svg>
                </div>
                <div className="summary-title-content">
                    <div className="title5">{allGroup?.length}</div>
                    <div className="summary-title">Groups</div>
                </div>
            </Paper>
            <Paper elevation={3} className="summary-paper">
                <div className="user-icon">
                    <svg
                        viewBox="0 0 16 16"
                        fill="#9e9285"
                        height="2em"
                        width="2em"
                    >
                        <path
                            fillRule="evenodd"
                            d="M1.75 1.5a.25.25 0 00-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h6.5a.25.25 0 00.25-.25v-9.5a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0114.25 13H8.06l-2.573 2.573A1.457 1.457 0 013 14.543V13H1.75A1.75 1.75 0 010 11.25v-9.5zM9 9a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"
                        />
                    </svg>
                </div>
                <div className="summary-title-content">
                    <div className="title5">0</div>
                    <div className="summary-title">Reports</div>
                </div>
            </Paper>
        </div>
    );
}
