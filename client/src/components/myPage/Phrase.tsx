import React, { useState, useRef } from 'react';

export default function Phrase(props: any): JSX.Element {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // edit btn 눌렀을 때 focus + 수정 가능 상태로 바뀜
    const changeReadOnly = (): void => {
        inputRef.current?.focus();
    };

    return (
        <div className="phrase-all-div">
            <label className="input-label">
                <textarea
                    onChange={(e) => props.setPhraseCtt(e.target.value)}
                    value={props.phraseCtt}
                    ref={inputRef}
                    maxLength={50}
                    className="input-obj"
                    id="text-area2"
                    style={{
                        display:
                            props.phraseModeBtnVal === 'recommend'
                                ? 'none'
                                : 'block',
                    }}
                />
            </label>

            <div className="phraseMode-btn-div">
                <label
                    className="phrase-label"
                    id="phraseMode-btn1"
                    style={{
                        background:
                            props.phraseModeBtnVal === 'recommend'
                                ? ' #94897c'
                                : '#d9d9d9',
                        color: 'white',
                    }}
                >
                    <input
                        className="phrase-radio"
                        type="radio"
                        name="phraseMode"
                        value="recommend"
                        onChange={(e) => props.phraseSelect(e)}
                    ></input>
                    추천해주세요
                </label>

                <label
                    className="phrase-label"
                    id="phraseMode-btn2"
                    style={{
                        background:
                            props.phraseModeBtnVal === 'self'
                                ? ' #94897c'
                                : '#d9d9d9',
                        color: 'white',
                    }}
                >
                    <input
                        className="phrase-radio"
                        type="radio"
                        name="phraseMode"
                        value="self"
                        onChange={(e) => props.phraseSelect(e)}
                    ></input>
                    내가 적을래요
                </label>
            </div>
        </div>
    );
}
