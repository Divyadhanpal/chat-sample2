// src/redux/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    chats: [],
    messages: [],
    conversations:[],
    status: 'idle',
    error: null,
    currentChatId: null,
};

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
    const response = await axios.get('http://localhost:8000/api/v1/chats');
    return response.data;
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatId) => {
    const response = await axios.get(`http://localhost:8000/api/v1/chats/${chatId}/messages`);
    return response.data;
});

// Define sendMessage action
export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ chatId, message }) => {
    const response = await axios.post(`http://localhost:8000/api/v1/chats/${chatId}`, { message });
    return response.data; // Return the response data
});

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action) => {
            state.chats.push(action.payload);
            state.currentChatId = action.payload.id;
            state.messages = [];
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setCurrentChat: (state, action) => {
            state.currentChatId = action.payload;
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(sendMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages.push({ type: 'bot', message: action.payload.reply_message }); 
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addChat, clearMessages, setCurrentChat } = chatSlice.actions;

export default chatSlice.reducer;