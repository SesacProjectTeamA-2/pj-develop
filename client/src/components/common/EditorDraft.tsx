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

import { convertToRaw, EditorState } from 'draft-js';
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

    const uploadCallback = () => {
        console.log('이미지 업로드');
    };

    return (
        <>
            {/*<div>{draftToHtml(convertToRaw(editorState.getCurrentContent()))}</div>*/}
            {<div style={{ height: '80px', overflow: 'auto' }}>{text}</div>}
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: uploadCallback },
                }}
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
