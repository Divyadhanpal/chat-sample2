import { useState, useEffect } from "react";
import TypingAnimation from "../components/TypingAnimation";
import { BsFillMicFill,BsSendFill } from "react-icons/bs"; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchMessages } from '../redux/slices/chatSlice';
import { FaRobot,FaUser } from "react-icons/fa";


const Chat = (props) => {
  const { toggleComponentVisibility, chatId } = props;
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const dispatch = useDispatch();
  const initialMessages = useSelector((state) => state.chat.messages) || [];

  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    setChatLog([]);
    setConversation(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceMessage(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }, []);

  const handleVoiceMessage = (message) => {
    const userMessage = { type: 'user', message };
    setChatLog((prevChatLog) => [...prevChatLog, userMessage]);
    sendMessage(message, chatId);
    console.log(chatId,"chatidfromvoice")
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = { type: 'user', message: inputValue };
    setChatLog((prevChatLog) => [...prevChatLog, userMessage]);
    sendMessage(inputValue, chatId);
    setInputValue('');
  };

  const sendMessage = (message, chatId) => {
    const url = `http://localhost:8000/api/v1/chats/${chatId}`;
    const data = { message };

    setIsLoading(true);
    axios.post(url, data)
      .then((response) => {
        const botReply = { type: 'bot', message: response.data.message };
        setChatLog((prevChatLog) => [...prevChatLog, botReply]);
        setIsLoading(false);
        stopRecording(); 
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 p-2">
            <FaRobot className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-sm text-gray-500">Always here to help</p>
          </div>
        </div>
        <button
          onClick={toggleComponentVisibility}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {conversation.length > 0 && conversation.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'Bot' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-start space-x-2 ${message.sender === 'Bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`rounded-full p-2 ${
                  message.sender === 'Bot' 
                    ? 'bg-gray-100 text-gray-500 order-first' 
                    : 'bg-gray-100 text-gray-500 order-last'
                }`}>
                  {message.sender === 'Bot' 
                    ? <FaRobot className="h-6 w-6" />
                    : <FaUser className="h-6 w-6" />
                  }
                </div>
                <div className={`rounded-lg p-3 max-w-md ${
                  message.sender === 'Bot' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {message.message}
                </div>
              </div>
            </div>
          ))}
          {chatLog.length > 0 && chatLog.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-start space-x-2 ${message.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`rounded-full p-2 ${
                  message.type === 'bot' 
                    ? 'bg-gray-100 text-gray-500 order-first' 
                    : 'bg-gray-100 text-gray-500 order-last'
                }`}>
                  {message.type === 'bot' 
                    ? <FaRobot className="h-6 w-6" />
                    : <FaUser className="h-6 w-6" />
                  }
                </div>
                <div className={`rounded-lg p-3 max-w-md ${
                  message.type === 'bot' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {message.message}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div key={chatLog.length} className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="rounded-full p-2 bg-gray-100 text-gray-500">
                  <FaRobot className="h-6 w-6" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-gray-800 max-w-md">
                  <TypingAnimation />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading || isRecording}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <button
                type="button"
                className={`p-2 ${isRecording ? 'text-red-500' : 'text-gray-400'} hover:text-gray-600`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <BsFillMicFill className="h-5 w-5" />
              </button>
              <button
                type="submit"
                className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                disabled={isLoading}
              >
                <BsSendFill className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;