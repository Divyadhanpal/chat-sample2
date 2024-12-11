import { useState, useEffect } from "react";
import TypingAnimation from "../components/TypingAnimation";
import styles from '@/styles/Home.module.css'
import axios from 'axios';
import { RxHamburgerMenu } from "react-icons/rx";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";


const Chat = (props) => {
  const { toggleComponentVisibility, chatId ,navChatId } = props;
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [conversation,setConversation] = useState([])

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (chatId) {
      const apiUrl = `http://localhost:8000/api/v1/chats/${chatId}/messages`;
      callApi(apiUrl);
    }
  }, [chatId]);

  const callApi = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      console.log(result, "result from navchat callapi get")
      // Assuming the ID is in result.id
      if (result) {
       alert(result,"result")
       setChatLog('')
       setConversation(result)
        console.log(chatLog, ":from navchatid api");
      setIsLoading(false);
      }
    } catch (error) {
       console.log('Error fetching data: ' + error.message);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])
    console.log("inputValue", inputValue,chatId)
    sendMessage(inputValue, chatId);

    setInputValue('');
  }

  const sendMessage = (message, chatId) => {
    const url = `http://localhost:8000/api/v1/chats/${chatId}`;

    const data = {
      message: message
    };

    setIsLoading(true);

    axios.post(url, data).then((response) => {
      console.log(response, ":from index");
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.reply_message }])
      console.log(chatLog, ":from index");
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error, "from index error");
    })
  }
  const emptyChatLog = () => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: '' }])
    console.log("inputValue", inputValue)
    // sendMessage(inputValue);

    setInputValue('');
  }
  return (
    <div className="flex h-full max-w-full flex-1 flex-col">
      {/* // for responsive */}
      <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white"
          onClick={toggleComponentVisibility}
        >
          <span className="sr-only">Open sidebar</span>
          <RxHamburgerMenu className="h-6 w-6 text-white" />
        </button>
        <h1 className="flex-1 text-center text-base font-normal">New chat</h1>
        <button type="button" className="px-3" >
          <BsPlusLg className="h-6 w-6" />
        </button>
      </div>

      <div className="container mx-auto max-w-[700px]  scroll-auto overflow-auto relative  bg-gray-900 ">

        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">ChatGPT</h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
            {
              chatLog.length && chatLog.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                  <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
                    } rounded-lg p-4 text-white max-w-sm`}>
                    {message.message}
                  </div>
                </div>
              ))
            }
            {
              conversation.length && conversation.map((message, index) => (
                <div  key={index}>
                <div  className={`flex justify-end`}>
                  <div className={`bg-purple-500 rounded-lg p-4 text-white max-w-sm`}>
                    {message.message}
                  </div>
                  
                </div>
                 <div className={`flex justify-start`}>
                 <div className={`bg-gray-800 rounded-lg p-4 text-white max-w-sm`}>
                   {message.reply_message}
                 </div>
                 
               </div>
                </div>
              ))
            }
            
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                  <TypingAnimation />
                </div>
              </div>
            }
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
            <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat;