import { io } from 'socket.io-client';

let socket = null;
export const getSocket = () => {
    if (!socket) {
        socket = io(`${process.env.REACT_APP_DB_HOST}/chat`);
    }
    return socket;
};
