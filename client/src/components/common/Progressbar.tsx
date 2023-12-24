import React from 'react';
import '../../styles/scss/components/progressbar.scss';
export default function Progressbar({
    score,
    bg,
    barColor,
}: {
    score: number;
    bg: string;
    barColor: string;
}) {
    const scorePercentage = score ? `${score}%` : '0%'; // undefined 인 경우

    // console.log(scorePercentage);
    // console.log(score);
    return (
        <div className="progress-div">
            <div className="my-progress" style={{ backgroundColor: `${bg}` }}>
                <div
                    className="my-bar"
                    style={{
                        width: scorePercentage,
                        backgroundColor: `${barColor}`,
                    }}
                ></div>
            </div>
        </div>
    );
}
