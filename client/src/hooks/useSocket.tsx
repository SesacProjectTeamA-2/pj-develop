import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Cookies } from 'react-cookie';

// let socket = null;

export default function useSocket() {
    // export default function useSocket(initialLogin: boolean) {
    const [currentSocket, setCurrentSocket] = useState<any>(null);
    // const [isSocketReady, setIsSocketReady] = useState(false);

    // console.log('******* useSocket *******');

    useEffect(() => {
        const cookie = new Cookies();
        const uToken = cookie.get('isUser');

        // console.log('initialLogin ::::', initialLogin);

        if (!currentSocket) {
            const newSocket = io(`${process.env.REACT_APP_DB_HOST}/chat`, {
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000, // 1초 간격으로 재시도
                reconnectionDelayMax: 5000, // 최대 5초 간격으로 재시도
                path: '/socket.io',
                extraHeaders: {
                    Authorization: `Bearer ${uToken}`,
                },
            });

            setCurrentSocket(newSocket);

            // 클린업 로직
            // return () => {
            //     // newSocket.close();
            //     setCurrentSocket(null);
            // };
        }
    }, [currentSocket]);

    return currentSocket;
}
