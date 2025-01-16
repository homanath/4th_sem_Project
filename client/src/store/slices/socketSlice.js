import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    connected: false,
    error: null
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setSocket, setConnected, setError } = socketSlice.actions;
export const selectSocket = (state) => state.socket;
export default socketSlice.reducer; 