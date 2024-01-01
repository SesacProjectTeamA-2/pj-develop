//=== 멤버 그룹 사이드바 ===

import '../../styles/scss/layout/sidebarGroup.scss';
import '../../styles/scss/components/modal.scss';
import WarningModal from './modal/WarningModal';
import ChoiceModal from './modal/ChoiceModal';
import { useState } from 'react';

export default function SideBarGroupMember({
    warningModalSwitch,
    setWarningModalSwitch,
    warningModalSwitchHandler,
    menu,
    setMenu,
    socket,
}: any) {
    // 멤버 선택하는 공통 모달
    const [choiceModalSwitch, setChoiceModalSwitch] = useState(false);

    const choiceModalSwitchHandler = (menu: string) => {
        setMenu(menu);
        setChoiceModalSwitch(!choiceModalSwitch);
    };

    return (
        <>
            <li className="sidebar-listItem secondary-menu">
                <span
                    className="sidebar-listItemText sub-menu-title"
                    style={{ color: '#9f9f9f' }}
                >
                    Menu
                </span>
                <div className="drop-down-menu-box">
                    <a
                        className="drop-down-menu-container"
                        style={{ marginBottom: '1rem' }}
                        onClick={() => warningModalSwitchHandler('모임 탈퇴')}
                    >
                        <div className="drop-down-menu-title">
                            <svg
                                viewBox="0 0 1024 1024"
                                fill="currentColor"
                                height="1.4em"
                                width="1.4em"
                                className="party-icon"
                            >
                                <path d="M678.3 655.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 00-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 518 759.6 444.7 759.6 362c0-137-110.8-248-247.5-248S264.7 225 264.7 362c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 00-80.4 119.5A373.6 373.6 0 00137 901.8a8 8 0 008 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 641.2 432.2 610 512.2 610c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 008.1.3zM512.2 534c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 01340.5 362c0-45.9 17.9-89.1 50.3-121.6S466.3 190 512.2 190s88.9 17.9 121.4 50.4A171.2 171.2 0 01683.9 362c0 45.9-17.9 89.1-50.3 121.6C601.1 516.1 558 534 512.2 534zM880 772H640c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
                            </svg>

                            <span className="sidebar-listItemText">탈퇴</span>
                        </div>
                    </a>
                    <a
                        className="drop-down-menu-container"
                        onClick={() => choiceModalSwitchHandler('신고')}
                    >
                        <div className="drop-down-menu-title">
                            <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                height="1.4em"
                                width="1.4em"
                                className="party-icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M1.75 1.5a.25.25 0 00-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h6.5a.25.25 0 00.25-.25v-9.5a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0114.25 13H8.06l-2.573 2.573A1.457 1.457 0 013 14.543V13H1.75A1.75 1.75 0 010 11.25v-9.5zM9 9a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"
                                />
                            </svg>

                            <span className="sidebar-listItemText">신고</span>
                        </div>
                    </a>
                </div>
            </li>

            {/* 경고 공통 모달 */}
            <WarningModal
                warningModalSwitch={warningModalSwitch}
                setWarningModalSwitch={setWarningModalSwitch}
                action={menu}
                socket={socket}
            />

            {/* 멤버 선택하는 공통 모달 */}
            <ChoiceModal
                choiceModalSwitch={choiceModalSwitch}
                setChoiceModalSwitch={setChoiceModalSwitch}
                choiceModalSwitchHandler={choiceModalSwitchHandler}
                action={menu}
            />
        </>
    );
}
