// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Editor, EditorState } from 'draft-js';
// import 'draft-js/dist/Draft.css';

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

import { convertToRaw, EditorState, AtomicBlockUtils } from 'draft-js';
// 이미지를 표시하기 위해 이미지를 로드하는 데 사용되는 Entity 타입인 ‘atomic’을 지원해야 합니다.
// https://colinch4.github.io/2023-11-24/11-09-13-449385-draftjs%EC%97%90%EC%84%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0/
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { Fragment } from 'react';
export default function Index() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [text, setText] = useState();

    const onEditorStateChange = function (editorState: any) {
        setEditorState(editorState);
        const { blocks } = convertToRaw(editorState.getCurrentContent());
        /*let text = blocks.reduce((acc, item) => {
      acc = acc + item.text;
      return acc;
    }, "");*/
        let text = editorState.getCurrentContent().getPlainText('\u0001');
        setText(text);
    };

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
            if (file) {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    resolve({ data: { link: e.target.result } });
                };
                reader.readAsDataURL(file);
            }
        });

        //-- if you want to use a file server to keep files then you might want to upload image on server and then simply put the link

        //    const data = new formdata();
        //    data.append("storyimage", file)
        //    axios.post(upload file api call, data).then(responseimage => {
        //         resolve({ data: { link: path to image on server } });
        //    })
        // }
    };

    const handleImageUpload = (e: any) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            const contentState = editorState.getCurrentContent();

            const contentStateWithEntity = contentState.createEntity(
                'atomic',
                'IMMUTABLE',
                { src: e.target.result }
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

    return (
        <>
            {/*<div>{draftToHtml(convertToRaw(editorState.getCurrentContent()))}</div>*/}
            {<div style={{ height: '40px', overflow: 'auto' }}>{text}</div>}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
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
