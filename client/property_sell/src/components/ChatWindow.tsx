import { toast } from "react-toastify";
import { APP_URL } from "../app_url";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useUser } from "../context/UserContext";

interface ChatWindowProps {
    selectedUser: {
        _id: string;
        username: string;
    } | null;
}

interface Message{
    message: string,
    sender_id: string
}

const ChatWindow = ({ selectedUser }: ChatWindowProps) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }
    const {user} = useUser();
    
    const handleSend = async(selectedUserId:string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error! Please log in.");
                return;
            }
            const response = await axios.post(`${APP_URL}/api/v1/chat/send-message/${selectedUserId}`,{message},{
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            toast.success("Message sent successfully!");
            setMessage(""); // Clear input after sending
        }
        catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (selectedUser?._id){
        const fetchMessages = async() => {
            try{
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    return;
                }
                const response = await axios.get(`${APP_URL}/api/v1/chat/${selectedUser._id}`,{
                    headers: { Authorization: `Bearer ${token}` },
                })
                setMessages(response.data.messages);
                console.log(response.data.messages);
            }
            catch(error) {
                console.log("get chat error:",error);
            }
        }
        fetchMessages();
        }
    },[selectedUser]);
            return(
            <div className="flex flex-col flex-1">
                    {/* Header */}
                    <div className="p-3 bg-blue-800 text-white font-semibold flex justify-between items-center rounded-t-lg">
                        <span>{selectedUser ? selectedUser.username  : "Select a chat"}</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        {messages.map((msg) => (
                            <>
                            {/* {msg.sender_id} {user?._id} */}
                            {msg.sender_id !== user?._id ? 
                            <div className="flex items-start space-x-2">
                                <div className="bg-gray-200 p-2 rounded-lg max-w-[75%]">
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            </div>: 
                            <div className="flex justify-end">
                                <div className="bg-blue-800 text-white p-2 rounded-lg max-w-[75%]">
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            </div>
                            }
                        
                        </>
                        ))}
                        
                    </div>

                    {/* Input Box */}
                    <div className="p-3 border-t flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            name= "message"
                            value={message}
                            onChange={handleMessage}
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                        <Button className="w-auto! px-4" onClick={() => selectedUser && handleSend(selectedUser._id)} >Send</Button>
                    </div>
                </div>
        )
}

export default ChatWindow;