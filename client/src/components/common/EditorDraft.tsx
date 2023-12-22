import {
    convertToRaw,
    EditorState,
    AtomicBlockUtils,
    ContentState,
} from 'draft-js';
// 이미지를 표시하기 위해 이미지를 로드하는 데 사용되는 Entity 타입인 ‘atomic’을 지원해야 합니다.
// https://colinch4.github.io/2023-11-24/11-09-13-449385-draftjs%EC%97%90%EC%84%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0/
import { useEffect, useState } from 'react';
import { Editor, SyntheticKeyboardEvent } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { Fragment } from 'react';

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Editor, EditorState } from 'draft-js';
// import 'draft-js/dist/Draft.css';

export default function EditorDraft({ value, handleEditorChange }: any) {
    console.log('------------------ value : ', value);
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
    // console.log('value ::::::', value);
    // console.log('text ::::::', text);

    const onEditorStateChange = function (editorState: any) {
        setEditorState(editorState);
        //     const { blocks } = convertToRaw(editorState.getCurrentContent());
        //     /*let text = blocks.reduce((acc, item) => {
        //   acc = acc + item.text;
        //   return acc;
        // }, "");*/
        //     // const text = blocks.map(block => block.text).join('\n');
        const text = editorState.getCurrentContent().getPlainText('\u0001');

        handleEditorChange(text);
    };

    //) MyPage.tsx

    // const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const formData = new FormData(); // 사진 담을 formData 객체 생성

    //     if (e.target.files && e.target.files[0]) {
    //         formData.append('image', e.target.files[0]);
    //         sendImg(formData);
    //     }
    // };

    // const sendImg = (formData: any): void => {
    //     const cookie = new Cookies();
    //     const uToken = cookie.get('isUser'); // 토큰 값

    //     try {
    //         axios
    //             .patch(
    //                 `${process.env.REACT_APP_DB_HOST}/user/mypage/userImg`,
    //                 formData,
    //                 {
    //                     headers: {
    //                         'Content-Type': 'multipart/form-data',
    //                         Authorization: `Bearer ${uToken}`,
    //                     },
    //                 }
    //             )
    //             .then((res) => {
    //                 console.log('post', res.data);
    //                 getUserData(); // 이거 해야 바로 수정된 프로필 사진으로 동기화 : 하지만 저장되지 않은 다른 값들은 초기화 돼서 옴 ㅜ
    //             });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const uploadCallback = (file: any) => {
        console.log('이미지 업로드 !', file);

        // return new Promise((resolve, reject) => {
        //     // Simulating image upload to a server
        //     setTimeout(() => {
        //         const uploadedImageURL =
        //             'https://example.com/uploaded-image.jpg';
        //         resolve({ data: { link: uploadedImageURL } });
        //     }, 2000);
        // });

        return new Promise((resolve, reject) => {
            // if (file) {
            //     let reader = new FileReader();
            //     reader.onload = (e: any) => {
            //         resolve({ data: { link: e.target.result } });
            //     };
            //     reader.readAsDataURL(file);
            // }

            //-- if you want to use a file server to keep files then you might want to upload image on server and then simply put the link

            const formData = new FormData();
            formData.append('file', file);

            // Replace 'your-upload-api-url' with your actual server API endpoint for image upload
            fetch('your-upload-api-url', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    const { link } = data;
                    console.log('Received image link from server:', link);
                    resolve({ data: { link } });
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    reject(error);
                });
        });
    };

    // const handleImageUpload = (e: any) => {
    //     e.preventDefault();
    //     const file = e.target.files[0];
    //     const reader = new FileReader();

    //     reader.onload = (e: any) => {
    //         const contentState = editorState.getCurrentContent();

    //         const contentStateWithEntity = contentState.createEntity(
    //             'atomic',
    //             'IMMUTABLE',
    //             { src: e.target.result }
    //         );

    //         const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    //         const newEditorState = EditorState.set(editorState, {
    //             currentContent: contentStateWithEntity,
    //         });

    //         setEditorState(
    //             AtomicBlockUtils.insertAtomicBlock(
    //                 newEditorState,
    //                 entityKey,
    //                 ' '
    //             )
    //         );
    //     };

    //     reader.readAsDataURL(file);
    // };

    return (
        <>
            {/*<div>{draftToHtml(convertToRaw(editorState.getCurrentContent()))}</div>*/}
            {/* {<div style={{ height: '40px', overflow: 'auto' }}>{text}</div>} */}
            {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
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
                        uploadenabled: true,
                        uploadCallback: uploadCallback,
                        previewimage: true,
                        inputaccept:
                            'image/gif,image/jpeg,image/jpg,image/png,image/svg',
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

// export default function EditorDraft() {
//     const [editorState, setEditorState] = React.useState(() =>
//         EditorState.createEmpty()
//     );

//     return (
//         <div>
//             <Editor editorState={editorState} onChange={setEditorState} />
//         </div>
//     );
// }
