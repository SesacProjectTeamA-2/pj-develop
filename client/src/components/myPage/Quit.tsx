import React, { useState } from 'react';
import WarningModal from '../common/modal/WarningModal';
import QuitModal from '../common/modal/QuitModal';

export default function Quit({ socket, uSeqData }: any) {
    const [warningModalSwitch, setWarningModalSwitch] = useState(false);

    const warningModalSwitchHandler = () => {
        setWarningModalSwitch(!warningModalSwitch);
    };

    const quitHandler = () => {
        warningModalSwitchHandler();
    };

    return (
        <div className="quit-div">
            {/* 모달 추가 */}
            <button id="quit-btn" onClick={quitHandler}>
                회원탈퇴
            </button>
            {/* 모임장일 경우, 위임하기 페이지로 이동 */}
            <p id="quit-notice">
                탈퇴 시 활동 정보가 모두 삭제되며 복구되지 않습니다.{' '}
            </p>

            <QuitModal
                warningModalSwitch={warningModalSwitch}
                setWarningModalSwitch={setWarningModalSwitch}
                warningModalSwitchHandler={warningModalSwitchHandler}
                action={'회원 탈퇴'}
                socket={socket}
                uSeqData={uSeqData}
            />
        </div>
    );
}
