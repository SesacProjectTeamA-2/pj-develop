//=== 멤버 그룹 사이드바 ===

import '../../styles/scss/layout/sidebarGroup.scss';
import '../../styles/scss/components/modal.scss';
import WarningModal from './modal/WarningModal';

export default function SideBarGroupMember({
    warningModalSwitch,
    setWarningModalSwitch,
    warningModalSwitchHandler,
    menu,
    setMenu,
    socket,
}: any) {
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
                        // className="member-leave"
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
                </div>
            </li>

            <WarningModal
                warningModalSwitch={warningModalSwitch}
                setWarningModalSwitch={setWarningModalSwitch}
                action={menu}
                socket={socket}
            />
        </>
    );
}
