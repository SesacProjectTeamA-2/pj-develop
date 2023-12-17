//=== 지울 예정 ===

import { io } from 'socket.io-client';
import { Cookies } from 'react-cookie';

let socket = null;

export const getSocket = () => {
    const cookie = new Cookies();
    const uToken = cookie.get('isUser');

    if (!socket) {
        socket = io(`${process.env.REACT_APP_DB_HOST}/chat`, {
            extraHeaders: {
                Authorization: `Bearer ${uToken}`,
            },
        });
    }
    return socket;
};
