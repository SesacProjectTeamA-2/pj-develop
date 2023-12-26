import {
    convertToRaw,
    EditorState,
    AtomicBlockUtils,
    ContentState,
} from 'draft-js';
// 이미지를 표시하기 위해 이미지를 로드하는 데 사용되는 Entity 타입인 ‘atomic’을 지원해야 합니다.
// https://colinch4.github.io/2023-11-24/11-09-13-449385-draftjs%EC%97%90%EC%84%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0/
import { useEffect, useState } from 'react';
// import Editor from '@draft-js-plugins/editor';
import { Editor, SyntheticKeyboardEvent } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { Fragment } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import createImagePlugin from '@draft-js-plugins/image';

// import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../../styles/scss/components/editor.scss';

const imagePlugin = createImagePlugin();

export default function EditorDraft({
    value,
    handleEditorChange,
    handleEditorImgUrl,
}: any) {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    // value를 사용하여 초기 EditorState를 생성
    const contentState = ContentState.createFromText(value);
    const initialEditorState = EditorState.createWithContent(contentState);
    const [editorState, setEditorState] = useState(initialEditorState);

    //) 초기 값 = 빈 값
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        if (value == '') return;
        const newContentState = ContentState.createFromText(value);
        const newEditorState = EditorState.createWithContent(newContentState);
        setEditorState(newEditorState);
    }, [value]);

    const onEditorStateChange = function (editorState: any) {
        setEditorState(editorState);
        const contentState = editorState.getCurrentContent();


        // Draft.js editorState를 HTML 문자열로 변환
        const htmlContent = draftToHtml(convertToRaw(contentState));

        // const text = editorState.getCurrentContent().getPlainText('\u0001');
        handleEditorChange(htmlContent);

    };

    // const uploadCallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const formData = new FormData(); // 사진 담을 formData 객체 생성

    //     if (e.target && e.target.files && e.target.files[0]) {
    //         formData.append('image', e.target.files[0]);
    //         sendImg(formData);
    //     }
    // };

    // const sendImg = async (formData: any) => {
    //     const cookie = new Cookies();
    //     const uToken = cookie.get('isUser');

    //     try {
    //         const res = await axios.post(
    //             `${process.env.REACT_APP_DB_HOST}/board/create/img`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                     Authorization: `Bearer ${uToken}`,
    //                 },
    //             }
    //         );

    //         if (res !== undefined && res.data !== undefined) {
    //             console.log('post', res.data);
    //         } else {
    //             console.log('post 요청에 대한 응답이 없습니다.');
    //         }
    //     } catch (err) {
    //         console.log('error 발생: ', err);
    //     }
    // };

    /////////////////////////

    // 이미지 업로드 요청 함수
    const sendImg = async (imageFile: any) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post(
                `${process.env.REACT_APP_DB_HOST}/board/create/img`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${uToken}`,
                    },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('이미지 업로드 오류:', error);
            throw error;
        }
    };

    // 이미지 업로드 이벤트 핸들러
    const uploadCallback = async (e: any) => {
        // e.preventDefault();

        try {
            console.log(e);

            // // e.target이 정의되었는지 확인
            // if (!e.target) {
            //     console.log('이벤트 타겟이 정의되지 않았습니다.');
            //     return;
            // }

            // const imageFile = e.target.files && e.target.files[0];

            // e가 이미지 파일 정보를 직접 포함하고 있습니다.
            const imageFile = e;

            if (!imageFile) {
                console.log('이미지가 선택되지 않았습니다.');
                return;
            }

            // 이미지 업로드 요청
            const { result, message, imageUrl } = await sendImg(imageFile);

            if (result) {
                console.log('이미지 업로드 성공');
                console.log(result);
                console.log('이미지 URL:', imageUrl);
                handleEditorImgUrl(imageUrl);

                //-- imageUrl을 사용하여 필요한 작업 수행

                // const file = imageFile;
                // const reader = new FileReader();

                // Atomic Block 추가 (이미지 미리보기)

                // reader.onload = () => {
                // const imageContent = `
                // <img src="${reader.result}" alt="uploaded image" />`;

                const contentState = editorState.getCurrentContent();

                const contentStateWithEntity = contentState.createEntity(
                    'atomic',
                    'IMMUTABLE',
                    { src: imageUrl } // 이미지 URL을 포함하는 엔터티 생성
                );

                const entityKey =
                    contentStateWithEntity.getLastCreatedEntityKey();

                if (entityKey) {
                    const newEditorState = EditorState.set(editorState, {
                        currentContent: contentStateWithEntity,
                    });

                    setEditorState(
                        AtomicBlockUtils.insertAtomicBlock(
                            newEditorState,
                            entityKey,
                            ' '
                        )
                    );
                    // }
                }

                // 업로드된 이미지 미리 보기를 추가
                return { data: { link: imageUrl, preview: imageUrl } };

                // reader.readAsDataURL(file);

                // const imageContent = `
                // <img src="${imageUrl}" alt="uploaded image" />`;

                // // 에디터의 내용 갱신
                // const updatedText = editorState
                //     .getCurrentContent()
                //     .getPlainText('\u0001');
                // handleEditorChange(updatedText);

                // const updatedContent = ContentState.createFromText(
                //     `${updatedText}\n${imageContent}`
                // );
                // const updatedEditorState =
                //     EditorState.createWithContent(updatedContent);

                // e.preventDefault();
                // const file = e.target.files[0];
                // const reader = new FileReader();

                // reader.onload = (e) => {
                //     const contentState = editorState.getCurrentContent();
                //     const contentStateWithEntity = contentState.createEntity(
                //         'atomic',
                //         'IMMUTABLE',
                //         { src: e && e.target && e.target.result }
                //     );

                //     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                //     const newEditorState = EditorState.set(editorState, {
                //         currentContent: contentStateWithEntity,
                //     });

                //     setEditorState(
                //         AtomicBlockUtils.insertAtomicBlock(
                //             newEditorState,
                //             entityKey,
                //             ' '
                //         )
                //     );
                // };

                // reader.readAsDataURL(file);
            } else {
                console.log('이미지 업로드 실패:', message);
            }
        } catch (error) {
            console.error('이미지 업로드 오류:', error);
        }
    };

    const handleImageUpload = (e: any) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
                'atomic',
                'IMMUTABLE',
                { src: e && e.target && e.target.result }
            );

            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.set(editorState, {
                currentContent: contentStateWithEntity,
            });

            setEditorState(
                AtomicBlockUtils.insertAtomicBlock(
                    newEditorState,
                    entityKey,
                    ' '
                )
            );
        };

        reader.readAsDataURL(file);
    };

    // const editorToHtml = draftToHtml(
    //     convertToRaw(editorState.getCurrentContent())
    // );

    return (
        <>
            {/*<div>{draftToHtml(convertToRaw(editorState.getCurrentContent()))}</div>*/}
            {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                // plugins={[imagePlugin]}
                // toolbar={{
                //     image: {
                //         uploadCallback: uploadCallback,
                //         alt: { present: true, mandatory: true },
                //     },
                // }}
                //===
                toolbar={{
                    // options: ['image'],
                    image: {
                        urlEnabled: true,
                        uploadEnabled: true,
                        uploadCallback: uploadCallback,
                        previewimage: true,
                        inputaccept: 'image/*',
                        // 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                        alt: { present: false, mandatory: false },
                        defaultsize: {
                            height: 'auto',
                            width: 'auto',
                        },
                    },
                }}
                //===
                placeholder="게시글을 작성해주세요"
                localization={{ locale: 'ko' }}
                editorStyle={{
                    height: '400px',
                    width: '100%',
                    border: '3px solid lightgray',
                    padding: '20px',
                }}
                mention={{
                    separator: ' ',
                    trigger: '@',
                    suggestions: [
                        { text: 'APPLE', value: 'apple' },
                        { text: 'BANANA', value: 'banana', url: 'banana' },
                        { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                        { text: 'DURIAN', value: 'durian', url: 'durian' },
                        {
                            text: 'EGGFRUIT',
                            value: 'eggfruit',
                            url: 'eggfruit',
                        },
                        { text: 'FIG', value: 'fig', url: 'fig' },
                        {
                            text: 'GRAPEFRUIT',
                            value: 'grapefruit',
                            url: 'grapefruit',
                        },
                        {
                            text: 'HONEYDEW',
                            value: 'honeydew',
                            url: 'honeydew',
                        },
                    ],
                }}
            />
        </>
    );
}
