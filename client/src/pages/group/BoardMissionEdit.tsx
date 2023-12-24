import React, { useState, ChangeEvent, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import Editor from './Editor';

import GroupHeader from '../../components/group/content/GroupHeader';
import { MissionType } from 'src/types/types';
import SuccessModal from 'src/components/common/modal/SuccessModal';
import EditorDraft from 'src/components/common/EditorDraft';

export default function BoardMissionEdit() {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    const { gSeq, mSeq, gbSeq } = useParams();

    console.log(gSeq, gbSeq);

    interface Mission {
        // mSeq: number;
        mTitle: string;
        mContent: string;
        mLevel: number;
        // map: string;
    }

    const [missionList, setMissionList] = useState<any>([]);

    const [initContent, setInitContent] = useState('');
    // <참고> 초기 에디터 내용 변하지 않아야 함
    //  <EditorDraft
    //     value={initContent}
    //     handleEditorChange={handleEditorChange}
    // />

    //] 게시글 수정 완료 모달창
    const [successModalSwitch, setSuccessModalSwitch] = useState(false);

    const successHandler = () => {
        setSuccessModalSwitch(true);
    };

    const getGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/group/detail/${gSeq}`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                setMissionList(res.data.groupMission);
            });
    };

    useEffect(() => {
        getGroup();
    }, []);

    console.log('>>>>>>', missionList);

    const [missionBoard, setMissionBoard] = useState<any>([]);

    //] 미션 게시글 조회
    const getBoardMission = async () => {
        const res = await axios
            .get(
                `${process.env.REACT_APP_DB_HOST}/board/${gSeq}/mission/${mSeq}/${gbSeq}`,
                {
                    headers: {
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            )
            .then((res) => {
                console.log('========', res.data.groupInfo);
                setMissionBoard(res.data.groupInfo);

                const { gbTitle, gbContent } = res.data.groupInfo;

                setBoard({
                    gbTitle,
                    gbContent,
                });

                setInitContent(gbContent); // 에디터 기존 내용 업데이트
            });
    };

    useEffect(() => {
        getBoardMission();
    }, []);

    // 미션 제목
    let missionTitle = '';

    for (let mission of missionList) {
        if (mission.mSeq === Number(mSeq)) {
            missionTitle = mission.mTitle;
        }
    }

    const [board, setBoard] = useState<any>({
        gbSeq: Number(gbSeq),
        gbTitle: '',
        gbContent: '',
        imgUrl: '',
    });

    //-- gbTitle state 관리
    const getValue = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setBoard({
            ...board,
            [name]: value,
        });

        // console.log(board);
        // console.log(name, value);
    };

    //-- gbContent관리
    const handleEditorChange = (value: string) => {
        setBoard({
            ...board,
            gbContent: value, // 에디터의 내용을 업데이트
        });
        // console.log(board);
    };

    //-- 게시글 이미지 첨부
    const handleEditorImgUrl = (url: any) => {
        setBoard({
            ...board,
            imgUrl: url,
        });
    };

    let replaced_str = board.gbContent.replace('<p>', '');
    let newContent = replaced_str.replace('</p>', '');

    // 게시물 edit
    const boardEditHandler = async () => {
        if (!board.gbTitle) {
            // 만약 gCategory가 비어있으면 알림을 표시
            toast.error('제목을 입력하세요', {
                duration: 2000,
            });
            return; // 함수 실행 중지
        }

        if (newContent === '<br>') {
            toast.error('내용을 입력하세요', {
                duration: 2000,
            });
            return;
        }

        const res = await axios.patch(
            `${process.env.REACT_APP_DB_HOST}/board/edit/${gbSeq}`,
            board,
            {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            }
        );
        console.log(res);

        successHandler();
    };

    console.log(board);

    return (
        <div className="section section-group">
            <GroupHeader title={`미션 ${missionTitle}`} groupName={''} />
            <div className="post-container">
                <div className="noti-content post-header title5">
                    <div className="post-title">
                        <div>제목</div>
                        <input
                            type="text"
                            placeholder="제목을 입력해주세요."
                            onChange={getValue}
                            name="gbTitle"
                            required
                            value={board.gbTitle}
                            className="input-board-edit"
                        />
                    </div>
                </div>
                <div>
                    <EditorDraft
                        value={initContent}
                        // value={board.gbContent} // 이렇게 하면 값이 지속적으로 변경되어, 커서 리렌더링 되는 문제 발생
                        handleEditorChange={handleEditorChange}
                        handleEditorImgUrl={handleEditorImgUrl}
                    />
                </div>
            </div>

            <SuccessModal
                successModalSwitch={successModalSwitch}
                setSuccessModalSwitch={setSuccessModalSwitch}
                action={'게시글을 수정'}
                gSeq={gSeq}
                gbSeq={gbSeq}
            />
            <div>
                <button className="editor-post-btn" onClick={boardEditHandler}>
                    수정 완료
                </button>
            </div>
        </div>
    );
}
