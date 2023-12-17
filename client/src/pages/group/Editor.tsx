import React, { useState, useMemo, useRef } from 'react';
import { render } from 'react-dom';

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github.css';

export default function Editor({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    // const [text, setText] = useState<string>("");

    const [content, setContent] = useState<string>('');
    const quillRef = useRef<ReactQuill | null>(null);

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['image'],
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                ],
                handlers: {
                    // image, imageHandler
                },
            },
        };
    }, []);

    const handleText = (value: any) => {
        // console.log(value);
        setContent(value);
        onChange(value);
    };

    // Quill 메뉴바에 불러올 기능
    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'image',
    ];

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value || ''}
            onChange={onChange}
            modules={modules}
            formats={formats}
        />
    );
}
