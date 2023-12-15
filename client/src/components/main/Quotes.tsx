import React from 'react';
import { kadvice } from 'kadvice';

import '../../styles/scss/pages/main.scss';

export default function Quotes(props: any) {
    const advice = kadvice.getOne();

    // console.log(props.phraseModeSelf);
    // console.log(props.phraseCtt);
    return (
        // <div className="content-grid-box quotes-div-flex">
        //     <div className="quotes ">
        //         <p>{advice.message}</p>

        //         {/* <div className="quotes-author-flex">
        //             <div> - {advice.author}</div>
        //         </div> */}
        //         <cite>
        //             <div> - {advice.author}</div>
        //         </cite>

        //         {/* <div className="quotes-btn-flex">
        //             <button>랜덤 생성</button>

        //             <img
        //                 src="/asset/icons/edit.svg"
        //                 alt="명언 편집 아이콘"
        //                 className="upload-img-icon"
        //             />
        //         </div> */}
        //     </div>
        // </div>
        <div className="content-grid-box sample2 ">
            <blockquote>
                {props.phraseModeSelf ? (
                    <>
                        <br />
                        <p>{props.phraseCtt}</p>
                        {/* <cite>{advice.author}</cite> */}
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
            </blockquote>
        </div>
    );
}
