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
    <div className="flex h-full w-full flex-1 flex-col bg-gray-50 border-r border-gray-200">
      <nav className={`flex h-full flex-col ${isCollapsed ? 'hidden' : 'block'}`}>
       

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto border-b border-gray-200">
          <div className="flex flex-col gap-1 p-2">
            {prevChats.length > 0 ? (
              prevChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => getIdFromNav(chat.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 hover:border-l-4 hover:border-blue-500 
                           transition-all duration-200 cursor-pointer group"
                >
                  <FiMessageSquare className="flex-none h-4 w-4 text-gray-500 group-hover:text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium truncate block">
                      {chat.title || `Chat ${chat.id}`}
                    </span>
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
        <div className="flex flex-col p-2 space-y-1 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            <AiOutlineMessage className="h-4 w-4 text-gray-500" />
            Clear conversations
          </button>

          <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
            <MdLogout className="h-4 w-4" />
            Log out
          </button>

          {/* Settings Button */}
          <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <AiOutlineSetting className="h-4 w-4 text-gray-500" />
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;