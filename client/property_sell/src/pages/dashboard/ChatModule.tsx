import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatSidebar from "../../components/ChatSidebar";
import ChatWindow from "../../components/ChatWindow";
import PanelLayout from "../../layouts/PanelLayout";
import { APP_URL } from "../../app_url";
import { toast } from "react-toastify";
import axios from "axios";

interface User {
    _id: string;
    username: string;
  }
  
const ChatModule = () => {
    const { selectedUserId } = useParams(); // Get selected user ID from URL
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Store selected user
    const navigate = useNavigate();

    // Function to handle user selection
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    // Fetch user data when `userid` changes
    useEffect(() => {
        if (selectedUserId) {
            const fetchUser = async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    navigate("/login");
                    return;
                }
                try {
                    const response = await axios.get(`${APP_URL}/api/v1/chat/get-user/${selectedUserId}`,{
                        headers:{ Authorization: `Bearer ${token}`}
                    })
                    const fetcheduser = response.data.data;
                    setSelectedUser(fetcheduser);
                    // console.log("fetched user:",fetcheduser)
                }
                catch (error:unknown) {
                    if(axios.isAxiosError(error)){
                        console.log(error.response?.data.message || "No User Found");
                    }
                    else{
                        console.log(error || "Something went wrong. Please try again later.");
                    }
                }
               
            }
            fetchUser();
        }
    }, [selectedUserId]);

    if(selectedUserId) {
        return (
            <PanelLayout>
                <div className="flex h-[500px] w-full border rounded-lg shadow-lg bg-white">
    
                    {/* Main Chat Section */}
                    <ChatWindow selectedUser={selectedUser} />
                </div>
            </PanelLayout>
        );
    }
    else {
        return (
            <PanelLayout>
                <div className="flex h-[500px] w-full border rounded-lg shadow-lg bg-white">
                    <ChatSidebar onUserSelect={handleUserSelect} />
                    <ChatWindow selectedUser={selectedUser} />
                </div>
            </PanelLayout>
        );
    }
}

export default ChatModule;
