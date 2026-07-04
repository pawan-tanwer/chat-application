import { React, useEffect, useState, useRef } from "react";
import useConversation from "../../zustand/useConversation";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { SocketContext } from "../../context/socketContext";
import notify from "../../assets/notification.mp3"

const MessageContainer = ({ onBackUser }) => {
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();
  const { authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();
  const [messageInput, setMessageInput] = useState("");
  const {socket} = useContext(SocketContext);
  

  //socket.io
  useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages,newMessage])
    })

    return ()=>socket?.off("newMessage");
  },[socket,setMessages,messages]);


  // send message to user
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return; // 
    try {
      const res = await axios.post(
        `http://localhost:8000/chat/message/send/${selectedConversation?._id}`,
        { message: messageInput },
        { withCredentials: true },
      );
      setMessages([...messages, res.data]); 
      setMessageInput(""); // input clear
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `http://localhost:8000/chat/message/${selectedConversation?._id}`,
          { withCredentials: true },
        );
        const data = get.data;
        if (data.success === false) {
          setLoading(false);
          return console.log("no message found");
        }
        setLoading(false);
        setMessages(data);
      } catch (error) {
        ``;
        setLoading(false);
        console.log(error);
      }
    };
    getMessages();
  }, [selectedConversation?._id, setMessages]);

  return (
    <div className="md:min-w-[500px] h-full flex flex-col py-2 border-l border-gray-300">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center">
            <p className="text-lg">
              Welcome👋 {authUser?.user?.fullName.toUpperCase()}😉
            </p>
            <p className="text-lg text-gray-600">
              Select a chat to start messaging
            </p>
            <TiMessages className="text-6xl text-gray-600 mt-4" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full px-2">
              <div className="md:hidden ml-1 self-center">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white rounded-full p-2 self-center text-gray-950"
                >
                  <IoArrowBackSharp size={15} />
                </button>
              </div>
              <div className="flex gap-2 items-center mr-2">
                <div className="self-center">
                  <img
                    className="w-10 h-10 rounded-full md:w-10 md:h-10 cursor-pointer border bg-amber-50"
                    src={selectedConversation?.profilePic}
                    alt="Profile"
                  />
                </div>
                <span className="font-semibold">
                  {selectedConversation?.fullName}
                </span>
              </div>
            </div>
          </div>
          {loading && (
            <div className="flex w-fullh-full flex-col items-center justify-center gap-4 bg-transparent">
              <div className="loading loading-spinner"></div>
            </div>
          )}
          {!loading && messages?.length === 0 && (
            <p className=" text-white items-center text-center">
              Send a message to start the conversation
            </p>
          )}
          <div
            className="overflow-y-auto flex-1 px-4 py-2"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-blue-500"></span>
              </div>
            )}

            {/* No messages */}
            {!loading && messages?.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400 text-center">
                  Send a message to start conversation
                </p>
              </div>
            )}

            {/* Messages */}
            {!loading &&
              messages?.length > 0 &&
              messages.map((message, index) => {
                const isSender =
                  message.senderId.toString() ===
                  authUser?.user?._id?.toString();
                return (
                  <div
                    key={index}
                    className={`flex mb-3 ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    {/* Doosre ka avatar */}
                    {!isSender && (
                      <img
                        src={selectedConversation?.profilePic}
                        className="w-8 h-8 rounded-full mr-2 self-end"
                        alt="avatar"
                      />
                    )}

                    <div className="flex flex-col">
                      {/* Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs text-sm break-words ${
                          isSender
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow"
                        }`}
                      >
                        {message?.message}
                      </div>
                      {/* Time */}
                      <span
                        className={`text-xs text-gray-400 mt-1 ${isSender ? "text-right" : "text-left"}`}
                      >
                        {new Date(message?.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Tumhara avatar */}
                    {isSender && (
                      <img
                        src={authUser?.user?.profilePic}
                        className="w-8 h-8 rounded-full ml-2 self-end"
                        alt="avatar"
                      />
                    )}
                  </div>
                );
              })}
          </div>
          <div className="p-3 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              className="flex-1 input input-bordered rounded-full h-10 bg-gray-100 text-black"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600"
            >
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
