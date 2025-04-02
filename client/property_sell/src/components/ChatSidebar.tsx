import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_URL } from "../app_url";
import { useUser } from "../context/UserContext";

interface User {
    _id: string;
    username: string;
}

interface Chat {
    _id: string;
    otherUser: User;
    users: User[];
    latestMessage?: {
      text: string;
    //   isRead: boolean;
    };
}

interface ChatSidebarProps {
    onUserSelect: (user: User) => void;
}

const ChatSidebar = ({ onUserSelect }: ChatSidebarProps) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(`${APP_URL}/api/v1/chat/chat-users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fetchedChats = response.data.data || [];

                // Transforming API response to match Chat interface
                const chatData: Chat[] = fetchedChats.map((chat: Chat ) => {
                    const otherUser = chat.users.find((u: User) => u._id !== user?._id);
                    return otherUser
                        ? {
                              _id: chat._id,
                              otherUser,
                              latestMessage: chat.latestMessage ?? { text: "No messages yet" }, 
                          }
                        : null;
                }).filter((chat: Chat): chat is Chat => chat !== null); // Filtering out null values

                setChats(chatData);
                
                if (chatData.length > 0) {
                    setSelectedChat(chatData[0]);
                    onUserSelect(chatData[0].otherUser);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    console.log(error.response.data.message || "No User Found");
                } else {
                    console.log(error || "Something went wrong. Please try again later.");
                }
            }
        };
        fetchChats();
    }, [user?._id, navigate]);

    return (
        <div className="w-1/4 border-r bg-gray-100 p-3 rounded-l-lg overflow-y-auto">
            <h2 className="font-semibold text-lg mb-3">Chats</h2>
            <ul className="space-y-2">
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className={`flex items-center p-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition-all ${
                            selectedChat?._id === chat._id ? "bg-gray-200" : "bg-white"
                        }`}
                        onClick={() => {
                            onUserSelect(chat.otherUser);
                            setSelectedChat(chat);
                        }}>
                        <div>
                            <div className="font-semibold">{chat.otherUser.username}</div>
                            <div className="text-sm text-gray-600 truncate max-w-[120px]"> {chat.latestMessage?.text}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatSidebar;


// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { APP_URL } from "../app_url";
// import { useUser } from "../context/UserContext";
// import { User } from "lucide-react";
// interface User {
//     _id: string;
//     username: string;
    
//   }
  
// interface ChatSidebarProps {
//     onUserSelect: (user: { _id: string; username: string;}) => void;
// }

// interface userType {
//     users: string[];
//     latestMessage: string; 
// }

// const ChatSidebar = ({ onUserSelect }:ChatSidebarProps) => {
//     const [users, setUsers] = useState<User[]>([]);
//     const [selectedUser, setSelectedUser] =useState<User | null>(null);
//     const navigate = useNavigate();
//     const {user} = useUser();
//     useEffect( () => {
//         const loggedInUserId = user?._id;
//         const fetchUsers = async() => {
//             try {
//                 const token = sessionStorage.getItem("token");
//                 if (!token) {
//                     toast.error("Authentication error! Please log in.");
//                     navigate("/login");
//                     return;
//                 }

//                 const response = await axios.get(${APP_URL}/api/v1/chat/chat-users,{
//                     headers:{Authorization: Bearer ${token}}
//                 })
//                 const fetchedUsers = response.data.data || [];

//                 // Filtering out the logged-in user before setting state

//                  const filteredUsers = fetchedUsers;
    
//                 // const filteredUsers = fetchedUsers.map((u:userType)=>{
//                 //     return u.users;
//                 // }).flat(3).filter((user:User) => user._id !== loggedInUserId);

//                 console.log("fetchedUsers :",fetchedUsers)
//                 // console.log("filteredUsers:",filteredUsers)
//                 setUsers(filteredUsers);

//                 if(filteredUsers.length !== 0) {
//                     setSelectedUser(filteredUsers[0]);
//                     onUserSelect(filteredUsers[0]);
//                 }
//             }
//             catch (error:unknown) {
//                 if(axios.isAxiosError(error)){
//                     if (error.response?.status === 404) {
//                         console.log(error.response.data.message || "No User Found");
//                     }
//                 }
//                 else {
//                     console.log(error || "Something went wrong. Please try again later.");
//                 }
//             }
//         }   
//         fetchUsers();
//     },[user?._id,navigate]);
    
//     return (
//         <div className="w-1/4 border-r bg-gray-100 p-3 rounded-l-lg overflow-y-auto">
//                     <h2 className="font-semibold text-lg mb-3">Chats</h2>
//                     <ul className="space-y-2">
//                     {users.map((user) => (
//                         <li key={user?._id} className={flex items-center p-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition-all ${selectedUser?._id === user._id ? "bg-gray-200" : "bg-white"}} onClick={() => {onUserSelect({ _id: user._id, username: user.username});setSelectedUser(user);}}>
//                             <div className="flex-1">
//                                 <div className="flex justify-between items-center">
//                                     <span className="font-semibold">{user.users[0]?.username}</span>
//                                     {/* <span className="text-sm text-gray-600 truncate max-w-[120px]">{user.latestMessage}</span> */}
//                                     {/* <span className="text-xs text-gray-500">10:30 AM</span> */}
//                                 </div>
//                                 {/* <div className="flex justify-between items-center">
//                                     <span className="text-sm text-gray-600 truncate max-w-[120px]">Hello! Are you interested?</span>
//                                     <div className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full">2</div>
//                                 </div> */}
//                             </div>
//                         </li>))}
//                     </ul>
//                 </div>
//     )
// }

// export default ChatSidebar;