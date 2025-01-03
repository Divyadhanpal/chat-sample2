// src/components/PreviousChats.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, addChat } from '../redux/slices/chatSlice';
import { BsChatLeftText } from 'react-icons/bs';

const PreviousChats = () => {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);
    const chatStatus = useSelector((state) => state.chat.status);

    useEffect(() => {
        if (chatStatus === 'idle') {
            dispatch(fetchChats());
        }
    }, [chatStatus, dispatch]);

    console.log('Chat object:', chats);

    if (chatStatus === 'loading') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (chatStatus === 'failed') {
        return (
            <div className="text-red-500 p-4 text-center">
                Error loading chats. Please try again later.
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <BsChatLeftText className="text-blue-500" />
                    Previous Chats
                </h2>
            </div>

            <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {chats.length === 0 ? (
                    <div className="text-center p-6 text-gray-500">
                        No previous chats found
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="group p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-200"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <BsChatLeftText className="text-blue-500 w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 font-medium truncate">
                                            {chat.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {chat.created_at 
                                                ? new Date(chat.created_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                  })
                                                : 'No date available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviousChats;