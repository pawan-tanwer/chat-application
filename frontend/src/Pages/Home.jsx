import {React,useState} from "react";
import Sidebar from "../components/home/Sidebar";
import MessageContainer from "../components/home/MessageContainer";

const Home = () => {
  const [selectedUser,setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handelUserSelect=(user)=>{
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar=()=>{
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  return (
  <div className="flex min-w-full md:min-w-[700px] md:max-w-[85%]
                  h-[95%] md:h-[85vh]
                  rounded-xl shadow-lg overflow-hidden
                  bg-gray-400 bg-clip-padding
                  backdrop-filter backdrop-blur-lg bg-opacity-0">

    {/* Sidebar — fixed width desktop pe */}
    <div className={`w-full md:w-72 flex-shrink-0 py-2
                    ${isSidebarVisible ? 'flex' : 'hidden'} md:flex`}>
      <Sidebar onSelectUser={handelUserSelect} />
    </div>

    {/* Divider — sirf ek, desktop pe */}
    <div className="hidden md:block w-[1px] bg-gray-300 flex-shrink-0"></div>

    {/* Message Container — flex-1 se baaki sari jagah le lega */}
    <div className={`flex-1 min-w-0
                    ${selectedUser ? 'flex' : 'hidden md:flex'}
                    flex-col`}>
      <MessageContainer onBackUser={handelShowSidebar}/>
    </div>
  </div>
)
};
export default Home;
