import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../redux/slices/chatSlice";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import FlowComponent from "../components/FlowComponent";
import axios from "axios";
import { ReactFlowProvider } from 'react-flow-renderer';
import { AiOutlineMenu, AiOutlinePlus, AiOutlineNodeIndex, AiOutlineClose } from "react-icons/ai";
import { MdLightMode, MdDarkMode } from "react-icons/md";

export default function Home() {
  const dispatch = useDispatch();
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [isChatWindowVisible, setIsChatWindowVisible] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  });

  const prevChats = useSelector((state) => state.chat.chats);

  useEffect(() => {
    if (prevChats.length === 0) {
      dispatch(fetchChats());
    }
  }, [prevChats, dispatch]);

  const getChatIDFromApi = async () => {
    const url = `http://localhost:8000/api/v1/chats`;
    try {
      const response = await axios.post(url);
      if (response.data.id) {
        setChatId(response.data.id);
        setIsChatWindowVisible(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const toggleChatWindow = () => {
    getChatIDFromApi();
  };

  const getIdFromNav = (id) => {
    setChatId(id);
    setIsChatWindowVisible(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className={`flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-16' : 'w-80'} ${isGraphVisible ? 'blur-sm cursor-pointer' : ''}`}
          onClick={() => isGraphVisible && setIsGraphVisible(false)}
        >
          <Sidebar
            onToggle={toggleChatWindow}
            prevChats={prevChats}
            getIdFromNav={getIdFromNav}
            isCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col border-r border-gray-200 dark:bg-navy-700 bg-white dark:bg-navy-800">
          <div 
            className={`h-full flex flex-col ${isGraphVisible ? 'blur-sm cursor-pointer' : ''}`}
            onClick={() => isGraphVisible && setIsGraphVisible(false)}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between gap-2">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors duration-200"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <AiOutlineMenu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <MdLightMode className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <MdDarkMode className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button 
                  onClick={() => setIsGraphVisible(!isGraphVisible)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label={isGraphVisible ? 'Hide Graph' : 'Show Graph'}
                >
                  <AiOutlineNodeIndex className={`h-5 w-5 ${isGraphVisible ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto relative">
              <div className="h-full">
                {isChatWindowVisible ? (
                  <Chat chatId={chatId} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <button 
                      onClick={toggleChatWindow}
                      className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                    >
                      <AiOutlinePlus className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </button>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Start a New Chat
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click the icon above to begin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Graph overlay */}
        {isGraphVisible && (
          <div className="fixed top-0 right-0 w-1/4 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <div className="h-full p-4 relative">
              <button 
                onClick={() => setIsGraphVisible(false)}
                className="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Close graph"
              >
                <AiOutlineClose className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <FlowComponent />
            </div>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}