import React from 'react';

export default function ProfilePic(props: any) {
    // 펜 버튼 hover event
    const missionEdit = document.querySelector('.mission-edit');
    const missionEditText = document.querySelector(
        '.mission-edit-text'
    ) as HTMLElement | null;

    missionEdit?.addEventListener('mouseover', () => {
        if (missionEditText !== null) {
            missionEditText.style.visibility = 'visible';
        }
    });
    missionEdit?.addEventListener('mouseout', () => {
        if (missionEditText !== null) {
            missionEditText.style.visibility = 'hidden';
        }
    });
    return (
        <div>
            <label id="profilePic-label">
                <img
                    src={props.userImgSrc || 'asset/images/emo2.gif'}
                    alt="profilePic"
                    id="profilePic-user"
                />
                <input
                    type="file"
                    id="profilePic-input"
                    name="image"
                    onChange={props.handlerChange}
                />
                <div className="mission-edit">
                    <img
                        src="/asset/icons/edit.svg"
                        alt="profilePicEdit"
                        id="profilePic-edit"
                    />
                    <div className="title8 mission-edit-text">수정</div>
                </div>
            </label>
        </div>
    );
}
