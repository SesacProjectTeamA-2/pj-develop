import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Cookies } from 'react-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import Modal from 'react-modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import '../../../styles/scss/components/modal.scss';
import ModalMemberList from './ModalMemberList';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
} from '@mui/material';
import { Line } from 'react-chartjs-2';

export default function ChoiceModal({
    choiceModalSwitch,
    setChoiceModalSwitch,
    choiceModalSwitchHandler,
    action,
    setKey,
}: any) {
    const { gSeq } = useParams();
    const nvg = useNavigate();

    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setGName(res.data.groupName);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    const [gName, setGName] = useState('');

    const doneHandler = () => {
        alert(`${gName}을 ${action}하셨습니다 !`);

        // [추후] 강제퇴장 멘트 작성

        setChoiceModalSwitch(false);
    };

    // 모달창 닫기
    const closeModalHandler = () => {
        setChoiceModalSwitch(false);
    };

    //=== 모임장 위임 ===
    const [selectedMemberId, setSelectedMemberId] = useState(0);
    const [selectedMemberName, setSelectedMemberName] = useState('');

    const patchLeader = async () => {
        const input = { newLeaderUSeq: selectedMemberId };

        console.log(input);

        if (!selectedMemberId) {
            alert('모임장 권한 넘길 멤버를 클릭해주세요.');
            return;
        }

        try {
            await axios
                .patch(
                    `${process.env.REACT_APP_DB_HOST}/group/leader/${gSeq}`,
                    input,
                    {
                        headers: {
                            Authorization: `Bearer ${uToken}`,
                        },
                    }
                )
                .then((res) => {
                    alert(
                        `${selectedMemberName} 님에게 모임장을 위임하였습니다.`
                    );

                    setChoiceModalSwitch(false);

                    // key 값을 변경하여 리렌더링 유도
                    setKey((prevKey: any) => prevKey + 1);

                    // nvg(`/group/home/${gSeq}`);
                });
        } catch (err) {
            console.log('>>>>', input);
            alert('모임장 위임에 실패하였습니다.');
        }
    };

    //] 모임장 : 위임 후 모임 삭제 (탈퇴 처리)
    //-- 남은 인원 2명 이상인 경우
    const patchLeaderThenDeleteGroup = async () => {
        const input = { newLeaderUSeq: selectedMemberId };

        console.log(input);

        if (!selectedMemberId) {
            alert('모임장 권한 넘길 멤버를 클릭해주세요.');
            return;
        }

        //] 위임 & 삭제 요청 한 번에 !
        try {
            //) 1. 모임장 위임 요청
            const patchLeaderFirst = await axios.patch(
                `${process.env.REACT_APP_DB_HOST}/group/leader/${gSeq}`,
                input,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            //) 2. 모임 탈퇴 요청
            const thenDeleteGroup = await axios.delete(
                `${process.env.REACT_APP_DB_HOST}/group/quit/${gSeq}`,
                {
                    data: { gSeq },
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );

            // .then((res) => {
            alert(`${selectedMemberName} 님에게 모임장을 위임하였습니다.`);

            setChoiceModalSwitch(false); // 모달창 닫기

            // key 값을 변경하여 리렌더링 유도
            setKey((prevKey: any) => prevKey + 1);

            // nvg(`/group/home/${gSeq}`);
            // });
        } catch (err) {
            alert('모임 탈퇴에 실패하였습니다.');
        }
    };

    //] 신고하기
    const [complainData, setComplainData] = useState<any>({
        // guSeq: 0,
        gSeq: Number(gSeq),
        cDetail: '',
        uSeq: 0,
        uName: '',
        // gName: '', //~[추후] 추가해야할수도
    });

    console.log('complainData:::::::', complainData);

    const reportDone = async () => {
        if (!complainData.uSeq) {
            alert('신고할 멤버를 선택해주세요 🚨');
            return;
        } else if (complainData.uDetail === '') {
            alert('신고 사유를 기재해주세요.');
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_DB_HOST}/group/complain/${complainData.guSeq}`,
                complainData,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );
            console.log('신고 성공 !!!!!!');
            console.log(res.data.isSuccess);

            if (!res.data.isSuccess) {
                // false 이면
                console.log('신고 실패 !!!!!!');

                console.log(res.data);
                alert(res.data.msg);
            } else {
                alert(`${selectedMemberName}님을 신고하였습니다.`);
            }
            closeModalHandler();
        } catch (err: any) {
            console.log('신고 실패 !!!!!!');

            console.log(err);
            alert(err.msg);
            closeModalHandler();
        }
    };

    const [state, setState] = React.useState<any>({
        ad: false,
        spam: false,
        swear: false,
        etc: false,
    });

    const [etcInput, setEtcInput] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //) 다중 선택
        // setState({
        //     ...state,
        //     [event.target.name]: event.target.checked,
        // });

        //) 단일 선택
        setState({ [event.target.name]: event.target.checked });

        switch (event.target.name) {
            case 'ad':
                setComplainData((prev: any) => ({
                    ...prev,
                    cDetail: '광고성 글 게시',
                }));
                break;
            case 'spam':
                setComplainData((prev: any) => ({
                    ...prev,
                    cDetail: '도배',
                }));
                break;
            case 'swear':
                setComplainData((prev: any) => ({
                    ...prev,
                    cDetail: '욕설',
                }));
                break;
            case 'etc':
                setComplainData((prev: any) => ({
                    ...prev,
                    cDetail: etcInput,
                }));
                break;
        }
    };

    //_ 아무것도 선택 안했을 경우, 빈 값
    useEffect(() => {
        if (!Object.values(state)[0]) {
            setComplainData((prev: any) => ({
                ...prev,
                cDetail: '',
            }));
        }
    }, [state]);

    const { ad, spam, swear, etc } = state;
    const error = [ad, spam, swear, etc].filter((v) => v).length !== 2;

    console.log('complainData>>>>>>>>>>>>>', complainData);
    console.log('state>>>>>>>>>>>>>', Object.values(state));

    return (
        <div>
            <Modal
                className="modal-style"
                overlayClassName="overlay"
                isOpen={choiceModalSwitch}
                onRequestClose={() => setChoiceModalSwitch(false)}
                ariaHideApp={false}
            >
                <div onClick={closeModalHandler}>
                    <img
                        className="modal-mission-add-close-icon"
                        src="/asset/icons/close.svg"
                        alt="close-icon"
                    />
                </div>
                <div className="modal-mission-cancel-content">
                    <div className="title5 modal-cancel-header">
                        <div className="modal-cancel-title-container">
                            <div className="title3">
                                {action === '신고'
                                    ? '🚨 관리자에게 신고하기'
                                    : action === '모임 위임 후 삭제'
                                    ? '모임장 권한 넘기기'
                                    : action}
                            </div>
                            <div className="title5 cancel-modal-description">
                                {action === '모임장 권한 넘기기'
                                    ? '누구에게 모임의 모든 권한을 넘길까요 ?'
                                    : action === '강제 퇴장'
                                    ? '누구를 모임에서 강제로 퇴장할까요 ?'
                                    : action === '신고'
                                    ? '누구를 신고할까요 ?'
                                    : action === '모임 위임 후 삭제'
                                    ? '누구에게 모임의 모든 권한을 넘길까요 ?'
                                    : ''}
                            </div>
                            <div
                                className="cancel-modal-description"
                                style={{
                                    color: 'gray',
                                }}
                            >
                                {action === '모임 위임 후 삭제'
                                    ? '모임장 권한을 넘겨야 탈퇴 처리가 됩니다.'
                                    : ''}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="modal-line"></div>
                    </div>

                    <ModalMemberList
                        action={action}
                        setChoiceModalSwitch={setChoiceModalSwitch}
                        closeModalHandler={closeModalHandler}
                        selectedMemberId={selectedMemberId}
                        setSelectedMemberId={setSelectedMemberId}
                        selectedMemberName={selectedMemberName}
                        setSelectedMemberName={setSelectedMemberName}
                        setComplainData={setComplainData}
                    />

                    {/* 신고일 경우, 사유 입력칸 */}
                    {action === '신고' ? (
                        <div className="modal-form">
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': {
                                        width: '67ch',
                                    },
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <FormControl
                                    sx={{ m: 3 }}
                                    component="fieldset"
                                    variant="standard"
                                >
                                    <FormLabel component="legend">
                                        사유를 기재하면, 관리자가 적절한 조치를
                                        취할 수 있습니다.
                                    </FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ad}
                                                    onChange={handleChange}
                                                    name="ad"
                                                />
                                            }
                                            label="광고성 글 게시"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={spam}
                                                    onChange={handleChange}
                                                    name="spam"
                                                />
                                            }
                                            label="도배"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={swear}
                                                    onChange={handleChange}
                                                    name="swear"
                                                />
                                            }
                                            label="욕설"
                                        />
                                        <div style={{ display: 'flex' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={etc}
                                                        onChange={handleChange}
                                                        name="etc"
                                                    />
                                                }
                                                style={{
                                                    marginRight: '1rem',
                                                    minWidth: '5rem',
                                                }}
                                                label="기타"
                                            />
                                            <TextField
                                                id="filled-multiline-flexible"
                                                label="30자 이내로 작성해주세요."
                                                multiline
                                                style={{
                                                    width: '30rem',
                                                }}
                                                maxRows={4}
                                                variant="filled"
                                                onChange={(e) => {
                                                    setComplainData(
                                                        (prev: any) => ({
                                                            ...prev,
                                                            cDetail:
                                                                e.target.value,
                                                        })
                                                    );

                                                    setEtcInput(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </FormGroup>
                                </FormControl>
                            </Box>
                        </div>
                    ) : (
                        <></>
                    )}

                    <div className="mission-cancel-btn-container">
                        {action === '모임장 권한 넘기기' ? (
                            <button
                                onClick={patchLeader}
                                className="btn-md leader-patch-btn"
                            >
                                {action}
                            </button>
                        ) : action === '모임 위임 후 삭제' ? (
                            <button
                                onClick={patchLeaderThenDeleteGroup}
                                className="btn-md leader-patch-btn"
                            >
                                모임 탈퇴
                            </button>
                        ) : action === '강제 퇴장' ? (
                            <button
                                // onClick={missionCancelDone}
                                className="btn-md mission-cancel-done-btn"
                            >
                                {action}
                            </button>
                        ) : action === '신고' ? (
                            <button
                                onClick={reportDone}
                                className="btn-md mission-cancel-done-btn"
                            >
                                {action}
                            </button>
                        ) : (
                            ''
                        )}
                        <button
                            onClick={closeModalHandler}
                            className="btn-md mission-cancel-back-btn"
                        >
                            취소
                        </button>
                    </div>

                    {/* <div className="mission-cancel-btn-container">
                        <button
                            onClick={doneHandler}
                            className="btn-md mission-cancel-done-btn"
                        >
                            {action}
                        </button>
                        <button
                            onClick={closeModalHandler}
                            className="btn-md mission-cancel-back-btn"
                        >
                            돌아가기
                        </button>
                    </div> */}
                </div>
            </Modal>
        </div>
    );
}
