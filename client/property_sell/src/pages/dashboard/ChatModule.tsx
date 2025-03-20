import { useParams } from "react-router-dom";
import ChatSidebar from "../../components/ChatSidebar";
import ChatWindow from "../../components/ChatWindow";
import PanelLayout from "../../layouts/PanelLayout";

const ChatModule = () => {
    const {userid} = useParams();
    // console.log(userid);
    if(userid) {
        return (
            <PanelLayout>
                <div className="flex h-[500px] w-full border rounded-lg shadow-lg bg-white">
    
                    {/* Main Chat Section */}
                    <ChatWindow/>
                </div>
            </PanelLayout>
        );
    }
    else {
        return (
            <PanelLayout>
                <div className="flex h-[500px] w-full border rounded-lg shadow-lg bg-white">
                    
                    {/* Sidebar - Chat List */}
                    <ChatSidebar/>
    
                    {/* Main Chat Section */}
                    <ChatWindow/>
                </div>
            </PanelLayout>
        );
    }
    
}

export default ChatModule;
