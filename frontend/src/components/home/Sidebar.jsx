import axios from "axios";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { SlLogout } from "react-icons/sl";
import useConversation from "../../zustand/useConversation";
import { SocketContext } from "../../context/socketContext";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();
  const { onlineUser, socket } = useContext(SocketContext);

  const isSearchUserOnline = (userId) => 
  onlineUser?.includes(userId?.toString());

  //socket.io
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
     setNewMessageUsers(newMessage)
    });

    return () => socket?.off("newMessage");
  }, [socket, messages]);

  // jin users se ho chuke hai
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(
          "http://localhost:8000/api/user/currentChatters",
          { withCredentials: true },
        );
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          return console.log("no user found");
        }
        setLoading(false);
        setChatUser(data.users);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);
  console.log("chatUser : ", chatUser);

  //user searchbar se  user lana
  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(
        `http://localhost:8000/api/user/search?search=${searchInput}`,
        { withCredentials: true },
      );
      console.log(search);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User not found");
      } else {
        setSearchInput('')
        setSearchUser(data);
        console.log("searchUser : ", data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handelUserClick = (user) => {
    console.log("user clicked : ", user);
    onSelectUser(user);
    setSelectedUserId(user?._id);
    setSelectedConversation(user);
    setNewMessageUsers('')
  };

  const handelClickBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handelLogout = async () => {
    console.log(authUser);
    const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
    if (confirmlogout === authUser?.user?.fullName) {
      setLoading(true);
      try {
        const logout = await axios.post(
          "http://localhost:8000/chat/auth/logout",
          { withCredentials: true },
        );
        const data = logout.data;
        if (data?.success === false) {
          setLoading(false);
          console.log(data?.message);
        }
        toast.success(data?.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("LogOut Cancelled");
    }
  };

  return (
  <div className="h-full w-full flex flex-col px-1">
    
    {/* Search + Avatar */}
    <div className="flex justify-between gap-2 items-center py-2">
      <form
        onSubmit={handelSearchSubmit}
        className="flex-1 flex items-center bg-white rounded-full overflow-hidden"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handelSearchSubmit(e)}
          placeholder="Search User"
          className="flex-1 px-4 bg-transparent outline-none text-sm text-black"
        />
        <button
        
          type="submit"
          className="btn btn-circle flex items-center justify-center 
                     bg-sky-700 hover:bg-gray-950 rounded-full size-10 flex-shrink-0"
        >
          <FaSearch />
        </button>
      </form>

      <img
        src={authUser.user?.profilePic}
        className="h-10 w-10 flex-shrink-0 border bg-white 
                   rounded-full hover:scale-110 cursor-pointer object-cover"
        alt="profile"
      />
    </div>

    <div className="divider my-0"></div>

    {/* User List */}
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {searchUser?.length > 0 ? (
        // Search results
        <div>
          {searchUser?.map((user, index) => (
            <div key={index}>
              <div
                onClick={() => handelUserClick(user)}
                className={`flex gap-3 items-center rounded p-2 py-2 cursor-pointer
                  ${selectedUserId === user?._id ? "bg-sky-500" : "hover:bg-white/20"}`}
              >
                <div className={`avatar ${isSearchUserOnline ? "online" : ""}`}>
                  <div className="w-10 rounded-full">
                    <img src={user?.profilePic} alt="user" />
                  </div>
                </div>
                <p className="font-bold text-gray-950 text-sm">{user?.fullName}</p>
              </div>
              <div className="h-[1px] bg-amber-300"></div>
            </div>
          ))}
        </div>
      ) : chatUser?.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center h-full gap-2 text-mauve-900 font-bold text-center px-2">
          <h1>Why are you alone</h1>
          <h1>Search Username to chat</h1>
        </div>
      ) : (
        // Chat users list
        <div>
          {chatUser?.map((user, index) => (
            <div key={index}>
              <div
                onClick={() => handelUserClick(user)}
                className={`flex gap-3 items-center rounded p-2 py-2 cursor-pointer
                  ${selectedUserId === user?._id ? "bg-sky-500" : "hover:bg-white/20"}`}
              >
                <div className={`avatar ${isSearchUserOnline ? "online" : ""}`}>
                  <div className="w-10 rounded-full">
                    <img src={user?.profilePic} alt="user" />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.fullName}</p>
                </div>
                {/* New message indicator */}
                {newMessageUsers?.reciverId === authUser?.user?._id && 
                 newMessageUsers?.senderId === user?._id && (
                  <div className="rounded-full bg-green-600 text-xs text-white px-1.5 py-0.5 flex-shrink-0">
                    +1
                  </div>
                )}
              </div>
              <div className="h-0.5 bg-amber-400"></div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Bottom — Back ya Logout */}
    <div className="py-2 flex-shrink-0">
      {searchUser?.length > 0 ? (
        <button
          onClick={handelClickBack}
          className="bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100"
        >
          <FaArrowLeftLong />
        </button>
      ) : (
        <button
          onClick={handelLogout}
          className="flex gap-2 items-center hover:bg-red-700 
                     hover:text-white rounded-lg p-2 transition-colors text-black"
        >
          <SlLogout size={20} />
          <p className="text-sm">Logout</p>
        </button>
      )}
    </div>
  </div>
)
};

export default Sidebar;
