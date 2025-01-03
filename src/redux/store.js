// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import flowReducer from './slices/flowSlice';

const store = configureStore({
    reducer: {
        chat: chatReducer,
        flow: flowReducer
    },
});

export default store;