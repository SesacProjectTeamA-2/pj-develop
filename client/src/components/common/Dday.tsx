import React, { useState } from 'react';

import '../../styles/scss/components/dday.scss';
import useDdayCount from '../../hooks/useDdayCount';

export default function Dday({ targetDate, setTargetDate, gDday }: any) {
    // const [targetDate, setTargetDate] = useState(''); // 오늘 날짜로 수정

    const dday = useDdayCount(targetDate);

    // const onChange = (e: any) => {
    //     setTargetDate(e.target.value);
    // };

    return (
        <div
            className="dday-container"
            style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
        >
            <input
                type="date"
                id="date-input"
                onChange={(e) => setTargetDate(e.target.value)}
                // value={gDday} // input default 값 처리 안됨
                defaultValue={gDday}
            />
            <div id="dday-text">{dday ? dday : `D-${gDday}`}</div>
        </div>
    );
}
