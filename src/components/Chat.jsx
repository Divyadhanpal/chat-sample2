import { useState, useEffect } from "react";
import TypingAnimation from "../components/TypingAnimation";
import { BsFillMicFill,BsSendFill } from "react-icons/bs"; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchMessages } from '../redux/slices/chatSlice';
import { FaRobot,FaUser } from "react-icons/fa";
import { BiLike, BiDislike } from "react-icons/bi";


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
    <div className="flex h-full flex-col bg-slate-50 dark:bg-navy-900">
      <div className="overflow-y-auto mx-auto w-full max-w-screen-lg xl:px-12 grow space-y-8 py-4 scrollbar-sm">
        {/* Welcome Section */}
        <div className="px-4 pt-6 text-[clamp(2.2rem,3.75vw,3.75rem)] font-medium leading-[1.1] tracking-tight">
          <span 
            className="block animate-shimmer bg-gradient-to-r from-violet-400 via-red-400 to-fuchsia-400 bg-clip-text font-semibold text-transparent" 
            style={{ animationDuration: '5s', backgroundSize: '200% 100%' }}
          >
            Welcome, John Doe
          </span>
          <span className="block text-slate-400 dark:text-navy-300">
            May I be of assistance today?
          </span>
        </div>

      

        {/* Existing Chat Messages */}
        <div className="space-y-8 pt-6 lg:pt-12 px-2 sm:px-4">
          {conversation.map((message, index) => (
            <div key={index}>
              {message.sender === 'User' ? (
                <div className="flex items-end justify-end gap-2.5 ml-4 sm:ml-10">
                  <div className="relative break-words print:border max-w-lg rounded-2xl bg-slate-150 p-3 dark:bg-navy-700 rounded-br">
                    {message.message}
                  </div>
                  <div className="avatar max-sm:hidden">
                    <div className="is-initial rounded-full bg-info text-white">
                      <FaUser className="size-5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-start gap-2.5 mr-4 sm:mr-10">
                  <div className="size-10 max-sm:hidden">
                    <div className="avatar">
                      <div className="is-initial rounded-full bg-info text-white">
                        <FaRobot className="size-5" />
                      </div>
                    </div>
                  </div>
                  <div className="relative break-words print:border w-full max-w-lg rounded-2xl rounded-bl border border-slate-200 p-3 dark:border-navy-600">
                    <div className="text-sm+">{message.message}</div>
                    <div className="-mx-1 flex justify-between pt-8">
                      <div className="flex space-x-1">
                        <button 
                          x-tooltip="'Copy'" 
                          className="btn-icon size-8 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                        </button>
                        <button className="btn-icon size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>
                        </button>
                        <button className="btn-icon size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex">
                        <button className="btn-icon size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <BiLike className="size-5" />
                        </button>
                        <button className="btn-icon size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <BiDislike className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Real-time chat messages */}
          {chatLog.map((message, index) => (
            <div key={index}>
              {message.type === 'user' ? (
                <div className="flex items-end justify-end gap-2.5 ml-4 sm:ml-10">
                  <div className="relative break-words print:border max-w-lg rounded-2xl bg-slate-150 p-3 dark:bg-navy-700 rounded-br">
                    {message.message}
                  </div>
                  <div className="avatar max-sm:hidden">
                    <div className="is-initial rounded-full bg-info text-white">
                      <FaUser className="size-5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-start gap-2.5 mr-4 sm:mr-10">
                  <div className="size-10 max-sm:hidden">
                    <div className="avatar">
                      <div className="is-initial rounded-full bg-info text-white">
                        <FaRobot className="size-5" />
                      </div>
                    </div>
                  </div>
                  <div className="relative break-words print:border w-full max-w-lg rounded-2xl rounded-bl border border-slate-200 p-3 dark:border-navy-600">
                    <div className="text-sm+">{message.message}</div>
                    <div className="-mx-1 flex justify-between pt-8">
                      <div className="flex space-x-1">
                        <button 
                          x-tooltip="'Copy'" 
                          className="btn-icon size-8 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                        </button>
                        <button className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>
                        </button>
                        <button className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex">
                        <button className="btn-icon size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <BiLike className="size-5" />
                        </button>
                        <button className="btn-icon size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                          <BiDislike className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading animation */}
          {isLoading && (
            <div  key={chatLog.length} className="flex items-end justify-start gap-2.5 mr-4 sm:mr-10">
              <div className="size-10 max-sm:hidden">
                <div className="avatar">
                  <div className="is-initial rounded-full bg-info text-white">
                    <FaRobot className="size-5" />
                  </div>
                </div>
              </div>
              <div className="relative break-words print:border w-full max-w-lg rounded-2xl rounded-bl border border-slate-200 p-3 dark:border-navy-600">
                <TypingAnimation />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-lg xl:px-16 px-3 sm:px-4 pb-4">
        <form onSubmit={handleSubmit} className="flex h-14 items-center justify-between rounded-full bg-slate-150 px-4 sm:px-6 dark:bg-navy-700">
          <input
            type="text"
            className="form-input h-9 w-full bg-transparent placeholder:text-slate-400/70 border-none outline-none focus:ring-0"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || isRecording}
          />
          <div className="flex">
            <button
              type="button"
              className="btn size-9 shrink-0 rounded-full p-0 text-slate-500 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-200 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <BsFillMicFill className="size-5" />
            </button>
            <button
              type="submit"
              className="btn size-9 shrink-0 rounded-full p-0 text-slate-500 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-200 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              disabled={isLoading}
            >
              <BsSendFill className="size-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;