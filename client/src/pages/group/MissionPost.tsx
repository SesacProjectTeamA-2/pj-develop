import React, { useState, ChangeEvent, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import 'react-quill/dist/quill.snow.css';
import { Link, useParams } from 'react-router-dom';

import '../../styles/scss/pages/group/post.scss';

import GroupHeader from '../../components/group/content/GroupHeader';
import EditorDraft from '../../components/common/EditorDraft';
// import Editor from './Editor';
import { GroupDetailType, MissionType } from 'src/types/types';
import SuccessModal from 'src/components/common/modal/SuccessModal';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

export default function MissionPost() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq, gCategory, mSeq } = useParams();

    const [missionList, setMissionList] = useState<any>();

    const getGroup = async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`,
            {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            }
        );

        setMissionList(res.data.groupMission);

        setMissionSelected(
            String(res.data.groupMission[Number(mSeq) - 1]?.mSeq)
        );
    };

    useEffect(() => {
        getGroup();
        // getGroupMission();
    }, []);

    console.log('missionList', missionList);

    const [board, setBoard] = useState<any>({
        gSeq: Number(gSeq),
        gbTitle: '',
        gbContent: '',
        gbCategory: 'mission',
        mSeq: Number(mSeq),
    });

    const [missionSelected, setMissionSelected] = useState('');
    const [selected, setSelected] = useState<any>(mSeq);

    console.log('missionSelected', missionSelected);

    //gbTitle state 관리
    const getValue = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setBoard({
            ...board,
            [name]: value,
        });
    };

    //] select 태그 state관리
    const handleSelect = (e: any) => {
        const selectedValue = e.target.value;
        setSelected(selectedValue);

        setBoard({
            ...board,
            gbCategory: 'mission',
            mSeq: Number(selectedValue),
        });
        console.log('Selected:', e.target.value);
    };

    //gbContent관리
    const handleEditorChange = (value: string) => {
        setBoard({
            ...board,
            gbContent: value, // 에디터의 내용을 업데이트
        });
    };

    //] 게시물 작성 완료 모달창
    const [successModalSwitch, setSuccessModalSwitch] = useState(false);

    const successHandler = () => {
        setSuccessModalSwitch(true);
    };

    let replaced_str = board.gbContent.replace('<p>', '');
    let newContent = replaced_str.replace('</p>', '');

    // 정보 post
    const boardPostHandler = async () => {
        if (!board.gbTitle) {
            toast.error('제목을 입력하세요', {
                duration: 2000,
            });
            return;
        }

        if (!board.gbContent) {
            toast.error('내용을 입력하세요', {
                duration: 2000,
            });
            return;
        }

        const res = await axios
            .post(`${process.env.REACT_APP_DB_HOST}/board/create`, board, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                console.log(res);
                successHandler();
            });
    };

    console.log(board);

    const [postMenu, setPostMenu] = useState(gCategory);

    useEffect(() => {
        setPostMenu(gCategory);
    }, []);

    if (postMenu === 'mission') {
        setPostMenu('미션');
    }

    return (
        <div className="section section-group">
            {/* <GroupHeader title={postMenu} groupName={''} /> */}
            <div className="post-container">
                <div className="noti-content post-mission-header title5">
                    {/* <div className="mission-type">
                        <div style={{ width: '7rem' }}>어떤 미션인가요 ?</div>
                        <div className="select-box">
                            <div>
                                <select
                                    onChange={handleSelect}
                                    value={selected}
                                >
                                    {missionList?.map(
                                        (mission: any, idx: number) => {
                                            return (
                                                <option
                                                    value={mission.mSeq}
                                                    key={idx}
                                                >
                                                    {mission.mTitle}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                        </div>
                    </div> */}

                    <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                    >
                        <InputLabel id="demo-simple-select-filled-label">
                            Mission
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            onChange={handleSelect}
                            value={selected}
                        >
                            {missionList?.map((mission: any, idx: number) => {
                                return (
                                    <MenuItem value={mission.mSeq} key={idx}>
                                        {mission.mTitle}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    {/* <div className="post-mission-title">
                        <div>제목</div>
                        <input
                            className="mission-input"
                            type="text"
                            placeholder="제목을 입력해주세요."
                            onChange={getValue}
                            name="gbTitle"
                            required
                        />
                    </div> */}

                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '30ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="standard-basic"
                            label="제목"
                            variant="standard"
                            onChange={getValue}
                            name="gbTitle"
                            required
                            // className="input-board-post"
                        />
                    </Box>
                </div>
                <div>
                    <EditorDraft
                        value={board.gbContent}
                        handleEditorChange={handleEditorChange}
                    />
                </div>
            </div>
            <div>
                <button className="editor-post-btn" onClick={boardPostHandler}>
                    인증 완료
                </button>

                <SuccessModal
                    successModalSwitch={successModalSwitch}
                    setSuccessModalSwitch={setSuccessModalSwitch}
                    action={'미션 인증글을 작성'}
                    gSeq={gSeq}
                    mSeq={mSeq}
                />
            </div>
        </div>
    );
}
