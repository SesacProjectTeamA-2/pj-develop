import React, { useState, ChangeEvent, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import 'react-quill/dist/quill.snow.css';
import { Link, useParams } from 'react-router-dom';

import '../../styles/scss/pages/group/post.scss';

import GroupHeader from '../../components/group/content/GroupHeader';

import { GroupDetailType, MissionType } from 'src/types/types';
import SuccessModal from 'src/components/common/modal/SuccessModal';
import EditorDraft from 'src/components/common/EditorDraft';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

export default function BoardPost() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq, gCategory, mSeq } = useParams();

    const [missionList, setMissionList] = useState<any>();

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setIsLeader(res.data.isLeader);

                setMissionList(res.data.groupMission);

                setMissionSelected(
                    String(res.data.groupMission[Number(mSeq) - 1]?.mSeq)
                );
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getGroup();
    }, []);

    console.log('missionList', missionList);

    // 1. 클릭한 곳 default 값
    // 1) Header - tilte
    // 2) select
    // 3) Link to
    // 2. select 변경 시 변경
    const [board, setBoard] = useState<any>({
        gSeq: Number(gSeq),
        gbTitle: '',
        gbContent: '',
        gbCategory: gCategory,
        mSeq: null,
    });

    const [isLeader, setIsLeader] = useState(false);
    const [missionSelected, setMissionSelected] = useState('');
    const [selected, setSelected] = useState<any>(gCategory);

    console.log('selected', selected);

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

        if (selectedValue === 'notice') {
            setBoard((prevBoard: any) => ({
                ...prevBoard,
                gbCategory: 'notice',
                mSeq: null,
            }));
        } else if (selectedValue === 'free') {
            setBoard({
                ...board,
                gbCategory: 'free',
                mSeq: null,
            });
        } else {
            setBoard({
                ...board,
                gbCategory: 'mission',
                mSeq: Number(selectedValue),
            });
        }
        console.log('Selected:', e.target.value);
        // console.log('setSelected 후', board);
    };

    //gbContent관리
    const handleEditorChange = (value: any) => {
        setBoard({
            ...board,
            gbContent: value, // 에디터의 내용을 업데이트
        });
        // console.log(board);
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

        if (newContent === '<br>') {
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
                console.log('boardPostHandler');

                successHandler();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log(board);

    const [postMenu, setPostMenu] = useState(gCategory);

    useEffect(() => {
        setPostMenu(gCategory);
    }, []);

    if (postMenu === 'notice') {
        setPostMenu('공지사항');
    } else if (postMenu === 'free') {
        setPostMenu('자유/질문');
    }

    return (
        <div className="section section-group">
            <div className="post-container">
                <div className="noti-content post-header title5">
                    {/* <div className="select-box">
                        <div className="title8">종류</div>
                        <select onChange={handleSelect} value={selected}>
                            <option value="notice">공지사항</option>
                            <option value="free">자유/질문</option>
                        </select>
                    </div> */}

                    <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                    >
                        <InputLabel id="demo-simple-select-filled-label">
                            종류
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            onChange={handleSelect}
                            value={selected}
                        >
                            {/* <MenuItem value="">
                                <em>None</em>
                            </MenuItem> */}

                            {/* 리더인 경우에만 공지사항 작성가능 */}
                            {/* {isLeader ? (
                                <MenuItem value="notice">공지사항</MenuItem>
                            ) : (
                                ''
                            )} */}

                            {isLeader && (
                                <MenuItem value="notice">공지사항</MenuItem>
                            )}

                            <MenuItem value="free">자유/질문</MenuItem>
                        </Select>
                    </FormControl>

                    {/* <div className="post-title">
                        <div>제목</div>
                        <input
                            type="text"
                            placeholder="제목을 입력해주세요."
                            onChange={getValue}
                            name="gbTitle"
                            required
                            className="input-board-post"
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
                        value="" // edit 에서는 기존 내용 넣어줌
                        handleEditorChange={handleEditorChange}
                    />

                    {/* === Quill Editor 삭제 예정 */}
                    {/* <Editor
                        value={board.gbContent}
                        onChange={handleEditorChange}
                    /> */}
                    {/* <EditorTest
                    // value={board.gbContent}
                    // onChange={handleEditorChange}
                    /> */}
                </div>
            </div>
            <div>
                <button className="editor-post-btn" onClick={boardPostHandler}>
                    작성 완료
                </button>

                <SuccessModal
                    successModalSwitch={successModalSwitch}
                    setSuccessModalSwitch={setSuccessModalSwitch}
                    action={`${postMenu}을 작성`}
                    gSeq={gSeq}
                />
            </div>
        </div>
    );
}
