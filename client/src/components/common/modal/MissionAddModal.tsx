import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';

import Modal from 'react-modal';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';

import '../../../styles/scss/components/modal.scss';

import Dday from '../Dday';
import useDdayCount from 'src/hooks/useDdayCount';

//-- Redux
// import { useDispatch, useSelector } from 'react-redux';
// import { MissionStateType, RootStateType } from '../../../types/types';
// import { addMission } from '../../../store/slices/missionSlice';

interface MissionAddModalProps {
    addModalSwitch: boolean;
    setAddModalSwitch: (value: boolean) => void;
    action: string;
}

export default function MissionAddModal({
    addModalSwitch,
    setAddModalSwitch,
    action,
    missionList,
    setMissionList,
    setInput,
    input,
    gDday,
    groupDetail,
    setKey,
}: any) {
    //] 1. 그룹 생성
    //-- action = 미션생성

    //] 2. 그룹 홈
    //-- action = 미션수정

    const cookie = new Cookies();
    const uToken = cookie.get('isUser'); // 토큰 값

    //--redux
    // const missionState = useSelector((state: RootStateType) => state.mission);
    // const dispatch = useDispatch();

    const { gSeq } = useParams();

    const closeModalHandler = () => {
        setAddModalSwitch(false);
    };

    console.log('missionList - ADD MODAL', missionList);

    const [missionInput, setMissionInput] = useState({
        // 새로 추가하는 미션
        id: missionList.length + 1,
        mTitle: '',
        mContent: '',
        mLevel: 1,
        mSeq: null,
        gDday: '',
    });

    //=== 초기 날짜 계산 ===
    const currentDate: any = new Date();

    // gDday일 이후의 날짜 계산
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + groupDetail?.groupDday);

    // 날짜를 "yyyy-mm-dd" 형식으로 변환하는 함수
    const formatDate = (date: any) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 초기 마감일
    let defaultDate = formatDate(futureDate);
    let today = formatDate(currentDate);

    // console.log('gDday', gDday);

    const [targetDate, setTargetDate] = useState(gDday);

    const [groupEditDday, setGroupEditDday] = useState<any>({
        gSeq: Number(gSeq),
        gName: groupDetail?.groupName,
        gDesc: groupDetail?.grInformation,
        gDday: defaultDate, // 날짜
        gCategory: groupDetail?.groupCategory,
        gCoverImg: groupDetail?.groupCoverImg,
        gMaxMem: groupDetail?.groupMaxMember,
    });

    // console.log('groupEditDday~~~~~~~~~~', groupEditDday);

    const { mTitle, mContent, mLevel } = missionInput;

    // 난이도 계산
    for (let mission of missionList) {
        switch (mission.mLevel) {
            case '5': {
                mission.mStar = '⭐️⭐️⭐️';
                break;
            }
            case '3': {
                mission.mStar = '⭐️⭐️';
                break;
            }
            case '1': {
                mission.mStar = '⭐️';
                break;
            }
            case 1: {
                mission.mStar = '⭐️';
                break;
            }
            default:
                break;
        }
    }

    ///// 이벤트 ////////
    const onChange = (e: any) => {
        const { name, value } = e.target;
        setMissionInput({ ...missionInput, [name]: value });
    };

    /////////// 추가 //////////////

    const oneMissionAddHandler = () => {
        // 유효성 검사
        if (!missionInput.mTitle) {
            toast.error('미션 제목을 입력해주세요', {
                duration: 2000,
            });
            return;
        } else if (!missionInput.mContent) {
            toast.error('미션 인증방법을 입력해주세요', {
                duration: 2000,
            });
            return;
        }

        const newMissions = [...missionList, missionInput];
        setMissionList(newMissions);

        // 입력 필드 초기화
        setMissionInput({
            id: missionList.length + 2,
            mTitle: '',
            mContent: '',
            mLevel: 1,
            mSeq: null,
            gDday,
        });
    };

    // console.log('missionList', missionList);

    interface EditMode {
        [key: number]: boolean;
    }

    const [editMode, setEditMode] = useState<EditMode>({});
    const [editedContents, setEditedContents] = useState<{
        [key: number]: string;
    }>({});

    const handleEditChange = (e: any, targetId: number) => {
        const { name, value } = e.target;

        setMissionInput({ ...missionInput, [name]: value });

        //     console.log('<<<<<<MissionInput>>>>>>>>>>>', missionInput);
    };

    // console.log('editedContents', editedContents);
    if (action === '미션수정') {
        for (let i = 0; i < missionList.length; i++) {
            missionList[i].id = i + 1;
        }
    }

    //=== 생성/수정, 삭제 데이터 data 하나에 담아서 보내기 ===

    // 기존 미션에서 삭제된 미션
    const [deleteList, setDeleteList] = useState<any>([]);

    // 최종 전송 데이터
    let [data, setData] = useState<any>({
        missionArray: [...missionList],
        deleteList: [...deleteList],
    });

    //] 최종으로 버튼 클릭 시
    const missionAddDoneHandler = () => {
        setAddModalSwitch(false);
        setTargetDate(targetDate);

        if (action === '미션생성') {
            setInput({
                ...input,
                missionArray: missionList,
                gDday: targetDate,
            });

            // console.log(
            //     '<<<<<<input : 그룹 생성에서 기존 Input>>>>>>>>>>>',
            //     input
            // );
        }

        //; 미션 수정 (PATCH, POST, DELETE)
        // missionList 최종 데이터만 보내기
        if (action === '미션수정') {
            setMissionInputs({
                ...input,
                missionArray: missionList,
                gDday: targetDate,
            });

            data = {
                missionArray: missionList,
                deleteList: deleteList,
            };

            setData({
                missionArray: [...missionList],
                deleteList: [...deleteList],
            });

            console.log('버튼 눌렀을 경우의 data ===== ', data);

            const patchDdayHandler = async () => {
                try {
                    await axios
                        .patch(
                            `${process.env.REACT_APP_DB_HOST}/group`,
                            groupEditDday,
                            {
                                headers: {
                                    Authorization: `Bearer ${uToken}`,
                                },
                            }
                        )
                        .then((res) => {
                            console.log('디데이 수정 >>', res.data);
                        });
                } catch (err) {
                    console.log(err);
                }
            };

            patchDdayHandler();

            const patchMissionListHandler = async () => {
                try {
                    await axios
                        .patch(
                            `${process.env.REACT_APP_DB_HOST}/mission/${gSeq}`,
                            data,
                            {
                                headers: {
                                    Authorization: `Bearer ${uToken}`,
                                },
                            }
                        )
                        .then((res) => {
                            console.log('patched', res.data);
                        });
                } catch (err) {
                    console.log(err);
                }
            };

            patchMissionListHandler();

            //++ window.location.reload(); 대신에,
            // key 값을 변경하여 리렌더링 유도
            setKey((prevKey: any) => prevKey + 1);
        }
    };

    console.log('==== 미션 최종 patch data====', data);

    //=== 수정 ===
    const [missionInputs, setMissionInputs] = useState(
        // 개별 input 관리 위한 함수
        missionList.map((mission: any) => ({
            id: mission.id,
            mTitle: mission.mTitle,
            mContent: mission.mContent,
            mLevel: mission.mLevel,
            mSeq: mission.mSeq,
            gDday: mission.gDday,
        }))
    );

    const editHandler = (targetId: number) => {
        const editedMissionIndex = missionInputs.findIndex(
            (mission: any) => mission.id === targetId
        );

        // console.log(targetId, editedMissionIndex);

        if (editedMissionIndex !== -1) {
            // 수정할 미션을 찾았을 때, 해당 미션 정보 수정
            const updatedMissionInputs = [...missionInputs];

            updatedMissionInputs[editedMissionIndex] = {
                ...updatedMissionInputs[editedMissionIndex],
                mTitle: missionInput.mTitle,
                mContent: missionInput.mContent,
                mLevel: missionInput.mLevel,
                gDday: missionInput.gDday,
            };
            setMissionInputs(updatedMissionInputs);
        }
    };

    //-- 날짜 업데이트
    // 1) 그룹 생성 시 마감일 지정
    const createHandleDateChange = (e: any) => {
        const newDay = e.target.value; // 날짜형식 입력값
        setTargetDate(newDay); // 날짜형식 입력값 업데이트
    };

    // 2) 미션 수정 시 마감일 지정
    const editHandleDateChange = (e: any) => {
        const newDay = e.target.value; // 날짜형식 입력값
        setTargetDate(newDay); // 날짜형식 입력값 업데이트

        const updatedGroupEditDday = { ...groupEditDday, gDday: newDay };
        setGroupEditDday(updatedGroupEditDday);

        // console.log('+++++groupEditDday', groupEditDday);
    };

    const dday = useDdayCount(targetDate);

    useEffect(() => {
        // missionInputs 배열을 복사하고 gDday 업데이트
        const updatedMissionInputs = missionInputs.map((mission: any) => {
            return {
                ...mission,
                gDday: targetDate,
            };
        });

        setMissionInputs(updatedMissionInputs);
    }, [dday]);

    //]  수정 시 onChange Event
    //-- 1. missionId에 해당하는 미션 제목 new Title로 변경
    const handleMissionTitleChange = (missionId: any, newContent: any) => {
        const updatedMissionList = missionList.map((mission: any) => {
            if (mission.id === missionId) {
                return { ...mission, mTitle: newContent };
            } else {
                return mission;
            }
        });
        setMissionList(updatedMissionList);
    };

    //-- 2. missionId에 해당하는 난이도 변경
    const handleMissionLevelChange = (missionId: any, newContent: any) => {
        const updatedMissionList = missionList.map((mission: any) => {
            if (mission.id === missionId) {
                return { ...mission, mLevel: newContent };
            } else {
                return mission;
            }
        });
        setMissionList(updatedMissionList);
    };

    //-- 3. missionId에 해당하는 미션 내용 newContent로 변경
    const handleMissionContentChange = (missionId: any, newContent: any) => {
        const updatedMissionList = missionList.map((mission: any) => {
            if (mission.id === missionId) {
                return { ...mission, mContent: newContent };
            } else {
                return mission;
            }
        });
        setMissionList(updatedMissionList);
    };

    // console.log('targetDate', targetDate);
    // console.log('dday', dday);

    const newDay = useDdayCount(targetDate);

    ////////////////////// 삭제////////////////////////
    const deleteHandler = (targetId: number) => {
        const filtered = missionList.filter(
            (mission: any) => targetId !== mission.id
        );

        setMissionList(filtered);
    };

    const EditModalDeleteHandler = (targetId: number) => {
        const filtered = missionList.filter(
            (mission: any) => targetId !== mission.id
        );

        const deleted = missionList.filter(
            (mission: any) => targetId === mission.id
        );

        setDeleteList([...deleteList, ...deleted]);

        setMissionList(filtered);

        setData({
            missionArray: [...missionList],
            deleteList: [...deleteList, ...deleted],
        });
    };

    console.log('===== deleteList =====', deleteList);

    return (
        <div className="modal-mission-add-container">
            <Modal
                className="modal-style-mission-add"
                overlayClassName="overlay-mission-add"
                isOpen={addModalSwitch}
                onRequestClose={() => setAddModalSwitch(false)}
                ariaHideApp={false}
            >
                <div className="modal-mission-add-upper">
                    <div
                        className="modal-mission-add-close"
                        onClick={closeModalHandler}
                    >
                        <img
                            className="modal-mission-add-close-icon"
                            src="/asset/icons/close.svg"
                            alt="close-icon"
                        />
                    </div>
                    <div className="title3 modal-title-mission-create">
                        {action === '미션생성'
                            ? '미션 생성하기'
                            : '미션 수정하기'}
                    </div>
                </div>

                <div className="modal-mission-add-content">
                    <div className="title5 modal-mission-header">
                        <div className="modal-mission-title">
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '40ch' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    id="title-basic"
                                    label="미션 제목"
                                    variant="standard"
                                    name="mTitle"
                                    onChange={onChange}
                                    value={mTitle}
                                />
                            </Box>
                        </div>
                        <FormControl fullWidth>
                            <InputLabel
                                variant="standard"
                                htmlFor="uncontrolled-native"
                            >
                                난이도
                            </InputLabel>
                            <NativeSelect
                                inputProps={{
                                    name: 'mLevel',
                                    id: 'uncontrolled-native',
                                }}
                                onChange={onChange}
                                value={mLevel}
                            >
                                <option value={1}>⭐️</option>
                                <option value={3}>⭐️⭐️</option>
                                <option value={5}>⭐️⭐️⭐️</option>
                            </NativeSelect>
                        </FormControl>
                    </div>

                    <div className="proof-box">
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 4, width: '67ch' },
                            }}
                            noValidate
                            autoComplete="off"
                            className="verify-box"
                        >
                            <TextField
                                id="filled-multiline-flexible"
                                label="인증 방법"
                                multiline
                                maxRows={4}
                                variant="filled"
                                name="mContent"
                                value={mContent}
                                onChange={onChange}
                            />
                        </Box>
                    </div>

                    <button
                        onClick={oneMissionAddHandler}
                        className="btn-md modal-btn-add"
                    >
                        미션 추가
                    </button>

                    <div className="modal-mission-list">
                        <div className="modal-mission-list-header">
                            <div className="title4">Mission List</div>

                            <div className="group-create-content modal-mission-box">
                                <div className="dday-container">
                                    <div className="deadline-text">마감일</div>

                                    {action === '미션생성' ? (
                                        <input
                                            type="date"
                                            id="date-input"
                                            onChange={createHandleDateChange}
                                            defaultValue={gDday}
                                            min={today}
                                        />
                                    ) : (
                                        <input
                                            type="date"
                                            id="date-input"
                                            onChange={editHandleDateChange}
                                            defaultValue={defaultDate}
                                            min={today}
                                        />
                                    )}

                                    {action === '미션생성' ? (
                                        <div id="dday-text">
                                            {gDday
                                                ? dday
                                                : dday
                                                ? dday
                                                : '언제까지 할까요 ?'}
                                        </div>
                                    ) : (
                                        <div id="dday-text">
                                            {/* {dday.length > 0
                                                ? dday
                                                : !isNaN(gDday)
                                                ? gDday < 0
                                                : `D+${gDday.substr(1)}`
                                                ? gDday == 0
                                                : 'D-DAY'
                                                ? `D-${gDday}`
                                                : gDday} */}
                                            {dday.length > 0
                                                ? dday
                                                : Number(gDday) < 0
                                                ? `D+${gDday * -1}`
                                                : Number(gDday) == 0
                                                ? 'D-DAY'
                                                : `D-${gDday}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <br />
                        <List
                            sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <div className="modal-mission-list-text">
                                {action === '미션생성' ? (
                                    !missionList.length ? (
                                        '현재 미션이 없습니다.'
                                    ) : (
                                        <>
                                            {/* 미션생성 모달 */}
                                            {missionList.map((mission: any) => {
                                                return (
                                                    <div key={mission.id}>
                                                        <Divider component="li" />

                                                        <ListItem
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection:
                                                                    'row',
                                                            }}
                                                        >
                                                            {/* 제목, 내용 div */}
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    flexBasis:
                                                                        '70%',
                                                                    flexDirection:
                                                                        'column',
                                                                    justifyContent:
                                                                        'space-between',
                                                                    margin: '0.8rem',
                                                                }}
                                                            >
                                                                <h3
                                                                    style={{
                                                                        marginBottom:
                                                                            '1rem',
                                                                    }}
                                                                >
                                                                    미션
                                                                    {
                                                                        mission.id
                                                                    }{' '}
                                                                    | 난이도{' '}
                                                                    {
                                                                        mission.mLevel
                                                                    }
                                                                </h3>

                                                                {/* 제목 + 난이도 */}
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        gap: '1rem',
                                                                    }}
                                                                >
                                                                    {/* 제목 */}
                                                                    <TextField
                                                                        label={`미션 ${mission.id} 제목`}
                                                                        variant="standard"
                                                                        name={`mTitle-${mission.id}`}
                                                                        fullWidth
                                                                        value={
                                                                            mission.mTitle
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleMissionTitleChange(
                                                                                mission.id,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        style={{
                                                                            marginBottom:
                                                                                '0.4rem',
                                                                        }}
                                                                    />

                                                                    {/* 난이도 */}
                                                                    <FormControl>
                                                                        <InputLabel
                                                                            variant="standard"
                                                                            htmlFor="uncontrolled-native"
                                                                        >
                                                                            난이도
                                                                        </InputLabel>
                                                                        <NativeSelect
                                                                            inputProps={{
                                                                                name: 'mLevel',
                                                                                id: 'uncontrolled-native',
                                                                            }}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleMissionLevelChange(
                                                                                    mission.id,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            value={
                                                                                mission.mLevel
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    1
                                                                                }
                                                                            >
                                                                                ⭐️
                                                                            </option>
                                                                            <option
                                                                                value={
                                                                                    3
                                                                                }
                                                                            >
                                                                                ⭐️⭐️
                                                                            </option>
                                                                            <option
                                                                                value={
                                                                                    5
                                                                                }
                                                                            >
                                                                                ⭐️⭐️⭐️
                                                                            </option>
                                                                        </NativeSelect>
                                                                    </FormControl>
                                                                </div>

                                                                {/* 내용 */}
                                                                <TextField
                                                                    label={`미션 ${mission.id} 인증 방법 `}
                                                                    variant="standard"
                                                                    name={`mTitle-${mission.id}`}
                                                                    fullWidth
                                                                    value={
                                                                        mission.mContent
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMissionContentChange(
                                                                            mission.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginBottom:
                                                                            '0.4rem',
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* 버튼 */}
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    flexDirection:
                                                                        'row',
                                                                    justifyContent:
                                                                        'center',
                                                                    flexBasis:
                                                                        '30%',
                                                                }}
                                                            >
                                                                <button
                                                                    className="modal-mission-edit-btn btn-sm"
                                                                    onClick={() =>
                                                                        editHandler(
                                                                            mission.id
                                                                        )
                                                                    }
                                                                >
                                                                    수정
                                                                </button>
                                                                <button
                                                                    className="modal-mission-delete-btn btn-sm"
                                                                    onClick={() =>
                                                                        deleteHandler(
                                                                            mission.id
                                                                        )
                                                                    }
                                                                >
                                                                    삭제
                                                                </button>
                                                            </div>
                                                        </ListItem>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )
                                ) : (
                                    <>
                                        {/* 미션수정 모달 */}
                                        {/* 미션 옆에 숫자 */}
                                        {missionList.map((mission: any) => {
                                            return (
                                                <div key={mission.id}>
                                                    <Divider component="li" />

                                                    <ListItem className="mission-edit-list-content">
                                                        {/* 제목, 내용 div */}
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexBasis:
                                                                    '70%',
                                                                flexDirection:
                                                                    'column',
                                                                justifyContent:
                                                                    'space-between',
                                                                margin: '0.8rem',
                                                            }}
                                                        >
                                                            <h3
                                                                style={{
                                                                    marginBottom:
                                                                        '1rem',
                                                                }}
                                                            >
                                                                미션
                                                                {mission.id} |
                                                                난이도{' '}
                                                                {mission.mLevel}
                                                            </h3>

                                                            {/* 제목 + 난이도 */}
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    gap: '1rem',
                                                                }}
                                                            >
                                                                {/* 제목 */}
                                                                <TextField
                                                                    label={`미션 ${mission.id} 제목`}
                                                                    variant="standard"
                                                                    name={`mTitle-${mission.id}`}
                                                                    fullWidth
                                                                    value={
                                                                        mission.mTitle
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMissionTitleChange(
                                                                            mission.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginBottom:
                                                                            '0.4rem',
                                                                    }}
                                                                />

                                                                {/* 난이도 */}
                                                                <FormControl>
                                                                    <InputLabel
                                                                        variant="standard"
                                                                        htmlFor="uncontrolled-native"
                                                                    >
                                                                        난이도
                                                                    </InputLabel>
                                                                    <NativeSelect
                                                                        inputProps={{
                                                                            name: 'mLevel',
                                                                            id: 'uncontrolled-native',
                                                                        }}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleMissionLevelChange(
                                                                                mission.id,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        value={
                                                                            mission.mLevel
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                1
                                                                            }
                                                                        >
                                                                            ⭐️
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                3
                                                                            }
                                                                        >
                                                                            ⭐️⭐️
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                5
                                                                            }
                                                                        >
                                                                            ⭐️⭐️⭐️
                                                                        </option>
                                                                    </NativeSelect>
                                                                </FormControl>
                                                            </div>

                                                            {/* 내용 */}
                                                            <TextField
                                                                label={`미션 ${mission.id} 인증 방법 `}
                                                                variant="standard"
                                                                name={`mTitle-${mission.id}`}
                                                                fullWidth
                                                                value={
                                                                    mission.mContent
                                                                }
                                                                onChange={(e) =>
                                                                    handleMissionContentChange(
                                                                        mission.id,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                style={{
                                                                    marginBottom:
                                                                        '0.4rem',
                                                                }}
                                                            />
                                                        </div>

                                                        {/* btn div */}
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection:
                                                                    'row',
                                                                justifyContent:
                                                                    'center',
                                                                flexBasis:
                                                                    '30%',
                                                            }}
                                                        >
                                                            <button
                                                                className="modal-mission-edit-btn btn-sm"
                                                                onClick={() =>
                                                                    editHandler(
                                                                        mission.id
                                                                    )
                                                                }
                                                            >
                                                                수정
                                                            </button>

                                                            <button
                                                                className="modal-mission-delete-btn btn-sm"
                                                                onClick={() =>
                                                                    EditModalDeleteHandler(
                                                                        mission.id
                                                                    )
                                                                }
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    </ListItem>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </List>
                    </div>
                </div>
                <div className="modal-mission-btn-container">
                    <button
                        onClick={missionAddDoneHandler}
                        className="btn-md modal-btn-done"
                    >
                        {action === '미션생성' ? '생성 완료' : '수정 완료'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
