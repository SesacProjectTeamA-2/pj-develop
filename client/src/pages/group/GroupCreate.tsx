import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import '../../styles/scss/pages/group/groupCreate.scss';

import MissionAddModal from '../../components/common/modal/MissionAddModal';
import { Divider, ListItem, ListItemText } from '@mui/material';
import SuccessModal from 'src/components/common/modal/SuccessModal';

export default function GroupCreate(socket: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const [addModalSwitch, setAddModalSwitch] = useState(false);

    const [selectedArr, setSelectedArr] = useState<string[]>([]);
    const [missionList, setMissionList] = useState<Mission[]>([]);

    const [input, setInput] = useState({
        gName: '',
        gDesc: '',
        gDday: '',
        gCategory: '',
        gCoverImg: '',
        gMaxMem: 1,
        missionArray: [],
    });

    console.log('missionList CREATE', missionList);

    const { gName, gDesc, gDday, gCategory, gCoverImg, gMaxMem, missionArray } =
        input;

    const [gSeq, setGSeq] = useState(0);

    const onChange = (e: any) => {
        const { name, value } = e.target;

        // 유효성 검사: 모임명
        if (name === 'gName' && value.length > 15) {
            toast.error('15자 이내의 모임명을 입력해주세요!', {
                duration: 2000,
            });

            const slicedInput = value.slice(0, 15);
            setInput({ ...input, [name]: slicedInput });
            e.target.focus();
            return;
        } else {
            setInput({ ...input, [name]: value });
        }

        // 유효성 검사: 모임 설명
        if (name === 'gDesc' && value.length > 500) {
            toast.error('500자 이내의 모임 설명을 입력해주세요!', {
                duration: 2000,
            });
            const slicedInput = value.slice(0, 500);
            setInput({ ...input, [name]: slicedInput });
            e.target.focus();
            return;
        } else {
            setInput({ ...input, [name]: value });
        }

        // 유효성 검사: 모임 인원
        if (name === 'gMaxMem') {
            const intValue = parseInt(value, 10); // 입력값을 정수로 변환

            if (isNaN(intValue) || intValue < 1) {
                // 숫자가 아니거나 1 미만인 경우
                toast.error('모임 인원은 1명 이상부터 가능합니다!', {
                    duration: 2000,
                });
                setInput({ ...input, [name]: 1 });

                e.target.value = '1';
                e.target.focus();
                return;
            } else if (isNaN(intValue) || intValue > 100) {
                // 숫자가 아니거나 1 미만인 경우
                toast.error('모임 인원은 100명 미만으로 가능합니다!', {
                    duration: 2000,
                });
                setInput({ ...input, [name]: 1 }); // 기본값으로 설정
                // 해당 input에 포커스를 이동
                e.target.value = '1'; // 입력값을 1로 설정
                e.target.focus();
                return;
            }
        }
    };

    const missionAddHandler = () => {
        setAddModalSwitch(true);
    };

    //-- 그룹 생성 완료 모달창
    const [successModalSwitch, setSuccessModalSwitch] = useState(false);

    const successHandler = () => {
        setSuccessModalSwitch(true);
    };

    //] 그룹 생성 성공 시, 채팅방 입장
    useEffect(() => {
        if (successModalSwitch) {
            console.log('joinRoom gSeq :::::', gSeq);
            console.log('joinRoom에 전송할 데이터 >>>', {
                gSeq: gSeq,
                isSignup: 'true',
            });

            socket.socket?.emit('joinRoom', { gSeq: gSeq, isSignup: 'true' });

            // 서버에서 보낸 data
            socket.socket?.on('loginNotice', (data: any) => {
                console.log('joinRoom event received on client', data);
            }); // {msg: '테스트1님이 모임에 참여하셨어요!'}
        }
    }, [successModalSwitch]);

    //] 그룹 생성 요청
    const groupCreateHandler = async () => {
        // 유효성 검사: 그룹 카테고리 미설정 방지
        if (!input.gCategory) {
            // 만약 gCategory가 비어있으면 알림을 표시
            toast.error('그룹의 카테고리를 선택해주세요!', {
                duration: 2000,
            });
            return; // 함수 실행 중지
        }
        //유효성 검사: 모임명 미입력 방지
        if (!input.gName) {
            // 만약 gName이 비어있으면 알림을 표시
            toast.error('모임명을 입력해주세요!', {
                duration: 2000,
            });

            // 입력 필드에 포커스를 맞춥니다.
            const gNameInput = document.querySelector(
                'input[name="gName"]'
            ) as HTMLInputElement | null;
            if (gNameInput) {
                gNameInput.focus();
            }

            return; // 함수 실행 중지
        }

        //유효성 검사: 모임설명 미입력 방지
        if (!input.gDesc) {
            // 만약 gName이 비어있으면 알림을 표시
            toast.error('모임 설명을 입력해주세요!', {
                duration: 2000,
            });

            // 입력 필드에 포커스를 맞춥니다.
            const gDescInput = document.querySelector(
                'input[name="gDesc"]'
            ) as HTMLInputElement | null;
            if (gDescInput) {
                gDescInput.focus();
            }

            return;
        }

        if (!input.missionArray.length) {
            toast.error('미션을 설정해주세요 !', {
                duration: 2000,
            });

            return;
        }

        if (input.gDday === '' || !input.gDday) {
            toast.error('미션의 마감일을 설정해주세요 !', {
                duration: 2000,
            });
            return;
        }

        const res = await axios
            .post(`${process.env.REACT_APP_DB_HOST}/group`, input, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);

                if (res.data.msg === '모임명이 중복되었습니다.') {
                    toast.error(res.data.msg);
                    return;
                } else if (input.gName) {
                    setGSeq(res.data.gSeq);
                    successHandler();
                }
            })
            .catch((res) => {
                toast.error(res.data.msg);
            });
    };

    console.log('input >> ', input);
    console.log('input.missionArray >> ', input.missionArray);

    //=== 관심 분야 ===
    interface Interested {
        id: string;
        category: string;
        val: string;
    }
    const interestedArr: Interested[] = [
        { id: 'tag-radio-ex', category: '운동', val: 'ex' },
        { id: 'tag-radio-re', category: '독서', val: 're' },
        { id: 'tag-radio-lan', category: '언어', val: 'lan' },
        { id: 'tag-radio-cert', category: '자격증', val: 'cert' },
        { id: 'tag-radio-st', category: '스터디', val: 'st' },
        { id: 'tag-radio-eco', category: '경제', val: 'eco' },
        { id: 'tag-radio-it', category: 'IT', val: 'it' },
        { id: 'tag-radio-etc', category: '기타', val: 'etc' },
    ];

    const [selectedInterestId, setSelectedInterestId] = useState('');

    // 분야 타입 선택
    const interestTypeHandler = (id: string) => {
        setSelectedInterestId(id);
    };

    //=== 미션 ===
    interface Mission {
        id: number;
        mTitle: string;
        mContent: string;
        mLevel: number;
        map: string;
        completed: boolean;
    }

    // const formData = new FormData();
    // formData.append('apple', 'apple');

    //] 대표사진 업로드
    // const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log('타겟', e.target.files);
    //     let image: any = null;

    //     if (e.target.files) {
    //         image = e.target.files[0];
    //         console.log(image);
    //         // formData.append('image', e.target.files['0']);
    //         // sendImg(formData);
    //         console.log(111111, input, formData);
    //         setInput({ ...input, [e.target.name]: e.target.files['0'] });
    //         console.log('input.gCoverImg!!!!!', input.gCoverImg);
    //     }

    //     addForm(image);
    //     // formData.append('image', image);
    //     // console.log('@@@@@@', formData);
    // };

    // const addForm = (image: any) => {
    //     formData.append('image', image);
    //     console.log(image);
    //     console.log('@@@@@@', formData);
    // };

    return (
        <div className="section group-create-contianer title5">
            <Toaster />
            <div className="title4">어떤 모임을 생성하고 싶나요 ?</div>
            <div className="group-create-content group-create-title">
                <div className="title-wrapper">
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '30ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="filled-basic"
                            label="모임명"
                            variant="filled"
                            onChange={onChange}
                            name="gName"
                            value={input.gName}
                            inputProps={{ maxLength: 16 }} //최대 글자 수 16으로 제한
                            // required
                        />
                        {/* <TextField
                            id="standard-basic"
                            label="모임명"
                            variant="standard"
                        /> */}
                    </Box>
                </div>
                {/* <form
                    encType="multipart/form-data"
                    method="post"
                    action=" http://localhost:8888/api/group"
                > */}

                {/* </form> */}
            </div>
            <div className="group-create-content">
                <div className="title5">분야</div>
                <div className="group-create-category">
                    {interestedArr.map((interest: Interested) => {
                        return (
                            <div key={interest.id}>
                                <label
                                    onClick={() =>
                                        interestTypeHandler(interest.id)
                                    }
                                    className="tag-btn"
                                    style={{
                                        background:
                                            selectedInterestId === interest.id
                                                ? '#ED8D8D'
                                                : 'white',
                                        color:
                                            selectedInterestId === interest.id
                                                ? 'white'
                                                : 'gray',
                                        border:
                                            selectedInterestId === interest.id
                                                ? '1px solid #ED8D8D'
                                                : ' #acacac',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="gCategory"
                                        className="tag-radio"
                                        value={interest.val}
                                        onChange={onChange}
                                        required
                                    />
                                    {interest.category}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="group-create-content description-container">
                <div className="title5">모임 설명</div>
                <textarea
                    className="description"
                    placeholder="500자 이내로 입력하세요."
                    onChange={onChange}
                    name="gDesc"
                    value={input.gDesc}
                    required
                ></textarea>
            </div>
            <div className="group-create-content">
                <div className="title5">제한 인원</div>
                <input
                    defaultValue={1}
                    className="limit-number"
                    type="number"
                    onChange={onChange}
                    name="gMaxMem"
                />
            </div>
            <div className="group-create-content mission-wrapper">
                <div className="mission-box-upper">
                    <div className="title5">Mission</div>
                    <div id="deadline-text">
                        {gDday ? (
                            `마감일 : ${gDday}`
                        ) : input.gDday ? (
                            input.gDday
                        ) : (
                            <div>
                                <strong>+ 버튼</strong>을 눌러{' '}
                                <strong>마감일</strong>을 설정해주세요 !
                            </div>
                        )}
                    </div>
                </div>
                <div className="mission-container">
                    <div
                        className="mission-plus-wrapper"
                        onClick={missionAddHandler}
                    >
                        <img src="/asset/icons/plus.svg" alt="plus mission" />
                    </div>

                    <div className="mission-list-container">
                        {missionList.length > 0 ? (
                            missionList.map((mission: any) => {
                                return (
                                    <div key={mission.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`미션 ${mission.id}. ${mission.mTitle} ${mission.mStar}`}
                                                secondary={`${mission.mContent}`}
                                            />
                                        </ListItem>
                                        {/* <Divider component="li" /> */}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="none-mission">
                                팀원들과 어떤 것을 하고 싶나요 ?
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {addModalSwitch ? (
                <MissionAddModal
                    addModalSwitch={addModalSwitch}
                    setAddModalSwitch={setAddModalSwitch}
                    action={'미션생성'}
                    missionList={missionList}
                    setMissionList={setMissionList}
                    setInput={setInput}
                    input={input}
                    gDday={gDday}
                />
            ) : null}
            <SuccessModal
                successModalSwitch={successModalSwitch}
                setSuccessModalSwitch={setSuccessModalSwitch}
                action={'모임을 생성'}
                groupName={input.gName}
            />
            <div className="btn-fixed-wrapper">
                <button
                    className="btn-fixed-rl"
                    onClick={() => groupCreateHandler()}
                >
                    <span className="shadow">
                        <span className="vert">
                            <span className="floating">
                                <span className="front">준비되셨나요 ?</span>
                                <span className="back">시작하기 !</span>
                            </span>
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
}
