import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_URL } from "../app_url";
import { useUser } from "../context/UserContext";
interface User {
    _id: string;
    username: string;  // Instead of 'username'
  }
  
interface ChatSidebarProps {
    onUserSelect: (user: { id: string; username: string; avatarUrl?: string }) => void;
}


const ChatSidebar = ({ onUserSelect }:ChatSidebarProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const {user} = useUser();
    useEffect( () => {
        const loggedInUserId = user?._id;
        const fetchUsers = async() => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(`${APP_URL}/api/v1/chat/all-users`,{
                    headers:{Authorization: `Bearer ${token}`}
                })
                const fetchedUsers = response.data.data || [];
    
                // Filtering out the logged-in user before setting state
                const filteredUsers = fetchedUsers.filter((u: User) => u._id !== loggedInUserId);
                setUsers(filteredUsers);
            }
            catch (error:unknown) {
                if(axios.isAxiosError(error)){
                    if (error.response?.status === 404) {
                        console.log(error.response.data.message || "No User Found");
                    }
                }
                else {
                    console.log(error || "Something went wrong. Please try again later.");
                }
            }
        }   
        fetchUsers();
    },[[user?._id]]); 
    return (
        <div className="w-1/4 border-r bg-gray-100 p-3 rounded-l-lg overflow-y-auto">
                    <h2 className="font-semibold text-lg mb-3">Chats</h2>
                    <ul className="space-y-2">
                    {users.map((user) => (
                        <li className="flex items-center p-2 rounded-lg shadow bg-white cursor-pointer hover:bg-gray-200 transition-all" onClick={() => onUserSelect({ id: user._id, username: user.username})}

>
                            <img src="https://i.pravatar.cc/40?img=1" alt="User 1" className="w-10 h-10 rounded-full mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{user.username}</span>

                                    {/* <span className="text-xs text-gray-500">10:30 AM</span> */}
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 truncate max-w-[120px]">Hello! Are you interested?</span>
                                    <div className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full">2</div>
                                </div> */}
                            </div>
                        </li>))}
                    </ul>
                </div>
    )
}

export default ChatSidebar;