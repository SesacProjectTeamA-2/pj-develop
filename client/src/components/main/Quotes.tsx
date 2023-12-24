import React, { useEffect, useState } from 'react';
import { kadvice } from 'kadvice';

import '../../styles/scss/pages/main.scss';

export default function Quotes(props: any) {
    const advice = kadvice.getOne();

    // useEffect(() => {
    //     const styleElement = document.querySelector('.typewriter');

    //     if (styleElement) {
    //         styleElement.textContent = `
    //         @keyframes typing {
    //           from {
    //             width: 0;
    //           }
    //           to {
    //             width: ${advice.message.length * 2}%;
    //           }
    //         }
    //       `;
    //     }
    //     // }, [animationDuration]);
    // }, []);

    const typewriterStyle = {
        '--animation-duration': `${
            props.phraseModeSelf
                ? props.phraseCtt.length * 2
                : advice.message.length * 2.4
        }%`,
    } as React.CSSProperties;

    // console.log(props.phraseModeSelf);
    // console.log(props.phraseCtt);
    return (
        <div className="content-grid-box sample2 ">
            <div className="console-box">
                <div className="console">
                    <div className="top">
                        <span className="options">⦿ ○ ○</span>
                        <span className="title">Mark My Word</span>
                    </div>
                    <div className="tabs"> </div>
                    <div className="text">
                        <span
                            className="typewriter animation"
                            style={typewriterStyle}
                        >
                            {props.phraseModeSelf
                                ? props.phraseCtt
                                : advice.message}
                        </span>
                        <br />
                        <br />
                        {props.phraseModeSelf ? (
                            <span className="blue"> {props.uName} </span>
                        ) : (
                            <span className="pink"> {advice.author}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* <blockquote>
                {props.phraseModeSelf ? (
                    <>
                        <br />
                        <p>{props.phraseCtt}</p>
                        <br />
                        <cite>
                            <div>- {props.uName} -</div>
                        </cite>
                        <br />
                    </>
                ) : (
                    <>
                        <br />
                        <p>{advice.message}</p>
                        <br />
                        <cite>
                            <div>- {advice.author}</div>
                        </cite>
                        <br />
                    </>
                )}
            </blockquote> */}
        </div>
    );
}
