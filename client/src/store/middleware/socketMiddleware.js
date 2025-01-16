import { io } from 'socket.io-client';
import { setSocket, setConnected, setError } from '../slices/socketSlice';

export const socketMiddleware = (store) => {
  let socket = null;

  return (next) => (action) => {
    const { auth } = store.getState();
    const { type } = action;

    if (type === 'auth/login/fulfilled' && !socket) {
      const token = localStorage.getItem('token');
      if (!token) return next(action);

      socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        withCredentials: true
      });

      socket.on('connect', () => {
        console.log('Socket connected successfully');
        store.dispatch(setConnected(true));
      });

      socket.on('welcome', (data) => {
        console.log('Welcome message:', data.message);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        store.dispatch(setError(error.message));
        
        // Try polling if websocket fails
        if (socket.io.opts.transports[0] === 'websocket') {
          console.log('Falling back to polling transport');
          socket.io.opts.transports = ['polling', 'websocket'];
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        store.dispatch(setConnected(false));
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        store.dispatch(setError(error.message));
      });

      store.dispatch(setSocket(socket));
    }

    if (type === 'auth/logout' && socket) {
      socket.disconnect();
      socket = null;
      store.dispatch(setSocket(null));
    }

    return next(action);
  };
}; 