import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Cookies } from 'react-cookie';

// let socket = null;

export default function useSocket() {
    const [currentSocket, setCurrentSocket] = useState<any>(null);
    // const [isSocketReady, setIsSocketReady] = useState(false);

    useEffect(() => {
        const cookie = new Cookies();
        const uToken = cookie.get('isUser');

        // if (!currentSocket) {
        const newSocket = io(`${process.env.REACT_APP_DB_HOST}/chat`, {
            extraHeaders: {
                Authorization: `Bearer ${uToken}`,
            },
        });

        setCurrentSocket(newSocket);

        // 클린업 로직
        return () => {
            // newSocket.close();
            setCurrentSocket(null);
        };
        // }
    }, []);

    return currentSocket;
}
