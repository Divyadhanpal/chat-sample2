import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../redux/slices/chatSlice";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import FlowComponent from "../components/FlowComponent";
import axios from "axios";
import { ReactFlowProvider } from 'react-flow-renderer';
import { AiOutlineMenu, AiOutlinePlus } from "react-icons/ai";

export default function Home() {
  const dispatch = useDispatch();
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [isChatWindowVisible, setIsChatWindowVisible] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGraphVisible, setIsGraphVisible] = useState(true);

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

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-16' : 'w-80'}`}
        >
          <div className="flex items-center p-4 border-b border-gray-200">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <AiOutlineMenu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <Sidebar
            onToggle={toggleChatWindow}
            prevChats={prevChats}
            getIdFromNav={getIdFromNav}
            isCollapsed={isSidebarCollapsed}
          />
        </div>

        <div className={`flex flex-col border-r border-gray-200 bg-white ${
          isGraphVisible ? 'w-1/2' : 'flex-1'
        }`}>
          <div className="p-4 border-b border-gray-200 flex gap-2">
            <button 
              onClick={toggleChatWindow} 
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 text-sm font-medium text-white 
                       bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
            >
              <AiOutlinePlus className="h-4 w-4" />
              New Chat
            </button>
            <button 
              onClick={() => setIsGraphVisible(!isGraphVisible)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700
                       bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 shadow-sm"
            >
              {isGraphVisible ? 'Hide Graph' : 'Show Graph'}
            </button>
          </div>

          <div className="flex-grow overflow-auto">
            {isChatWindowVisible ? (
              <Chat chatId={chatId} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="rounded-full bg-blue-100 p-3 mb-4">
                  <AiOutlinePlus className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a New Chat
                </h3>
                <p className="text-sm text-gray-500">
                  Click the <span className="font-medium text-blue-500">New Chat</span> button above to begin
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modified Flow Component section */}
        {isGraphVisible && (
          <div className="w-1/2 bg-white">
            <div className="h-full p-4 bg-gray-50">
              <FlowComponent />
            </div>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}