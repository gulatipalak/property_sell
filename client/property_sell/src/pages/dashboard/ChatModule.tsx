import { useParams } from "react-router-dom";
import { useState } from "react";
import ChatSidebar from "../../components/ChatSidebar";
import ChatWindow from "../../components/ChatWindow";
import PanelLayout from "../../layouts/PanelLayout";

interface User {
    id: string;
    name: string;
    avatarUrl?: string;
  }
  
const ChatModule = () => {
    const { userid } = useParams(); // Get selected user ID from URL
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Store selected user
    // const navigate = useNavigate(); 

    // Function to handle user selection
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        // navigate(`/chat/${user.id}`); // Update URL with user ID
    };

    if(userid) {
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
