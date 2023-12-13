import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { getSocket } from 'src/socket';
import { io } from 'socket.io-client';

import Content from '../components/main/Content';

export default function Main() {
    const socket = getSocket();

    //_ loginData = {uSeq, uName, [gSeq]}
    const [loginData, setLoginData] = useState([]); // socket 서버 전송
    const [uName, setUName] = useState(''); // 닉네임
    const [uSeq, setUSeq] = useState(1); // 유저 번호
    const [gSeq, setGSeq] = useState([]); // 참여 모임

    const getChat = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/chat`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const socket = io(`${process.env.REACT_APP_DB_HOST}/chat`);

                console.log('????????', res);

                socket.on('connect', () => {
                    console.log('socket server connected.');
                });

                // 닉네임 서버에 전송
                // socket.emit('setName', uName);
            });
    };

    // 1. 사용자 명언 정보 가져오기
    // 1-1. 명언 변수
    const [phraseCtt, setPhraseCtt] = useState<string | null>(null);

    // 1-2. 명언 지정 논리연산자
    //  데이터 가져와서 phrase null이 아니면 true로(자기 작성 모드) : Quotes 컨텐츠 가림
    //  null 이라면 false로 (명언 모드) : Quotes 컨텐츠 보임
    const [phraseModeSelf, setPhraseModeSelf] = useState<boolean>(false);

    // 2. 회원가입 url에서 user 정보 가져오기
    const curPath: string = window.location.href;
    const urlParams: any = new URLSearchParams(curPath);

    const uToken: string = urlParams.get('token');

    // 3. 쿠키 굽기
    let myCookie = new Cookies();
    if (uToken) {
        myCookie.set('isUser', uToken);

        getChat();

        // socket.emit('login', () => {
        //     console.log('클라이언트 login ======= ', loginData);
        // });
    }

    useEffect(() => {
        getChat();
    }, []);

    // console.log('isUser', myCookie.get('isUser'));

    //=== 채팅 login ===

    // 1. 사용자 데이터 가져오기
    const getUserData = async () => {
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/user/mypage`, {
                headers: {
                    Authorization: `Bearer ${uToken}`,
                },
            })
            .then((res) => {
                const { nickname } = res.data;
                setUName(nickname);
                // console.log('===========', res.data);
            });
    };

    useEffect(() => {
        getUserData();
    }, []);

    //_ loginData = {uSeq, uName, [gSeq]}
    console.log('loginData::::::', loginData);

    return (
        <div className="section-main">
            <Content />
        </div>
    );
}
