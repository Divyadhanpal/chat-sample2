import React from "react";
import {
  AiOutlineMessage,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

const Sidebar = ({ isCollapsed, prevChats, getIdFromNav }) => {
  return (
    <div className="flex h-full w-full flex-1 flex-col  border-r border-slate-150 shadow-md dark:border-navy-600">
      <nav className={`flex h-full flex-col ${isCollapsed ? 'hidden' : 'block'}`}>
        {/* Recent Chats Header */}
        <div className="flex min-w-0 items-center justify-between px-4 py-2">
          <span className="truncate text-tiny+ font-medium uppercase">Recent Chats</span>
          <button className="btn -mr-1.5 size-6 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto border-b border-slate-150 dark:border-navy-600">
          <div className="flex flex-col p-2">
            {prevChats.length > 0 ? (
              prevChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => getIdFromNav(chat.id)}
                  role="button"
                  className="group flex space-x-2 w-full min-w-0 items-start justify-start p-2 text-xs+ rounded-lg tracking-wide text-slate-800 outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:text-navy-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>

                  <div className="-mt-px flex min-w-0 flex-1 items-center justify-between gap-2 text-start">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-slate-700 dark:text-navy-100">
                        {chat.title || `Chat ${chat.id}`}
                      </p>
                    
                    </div>
                  
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-500 text-sm">
                No previous chats
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col p-2 space-y-1 border-t border-slate-150 dark:border-navy-600">
          <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 dark:text-navy-100 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            <AiOutlineMessage className="h-4 w-4 " />
            Clear conversations
          </button>

          <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 rounded-lg dark:text-navy-100 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
            <MdLogout className="h-4 w-4" />
            Log out
          </button>

          {/* Settings Button */}
          <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 dark:text-navy-100 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <AiOutlineSetting className="h-4 w-4" />
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;