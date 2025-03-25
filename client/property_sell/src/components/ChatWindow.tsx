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

interface Message {
    text: string;
    senderId: string;
}

const ChatWindow = ({ selectedUser }: ChatWindowProps) => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const { user, socket } = useUser();

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleSend = async (selectedUserId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error! Please log in.");
                return;
            }
            const response = await axios.post(
                `${APP_URL}/api/v1/chat/send-message/${selectedUserId}`,
                { text },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessages((prevMessages) => [...prevMessages, response.data.data]);
            socket?.emit("newMessage", response.data.data); 
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (selectedUser?._id) {
            const fetchMessages = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        toast.error("Authentication error! Please log in.");
                        return;
                    }
                    const response = await axios.get(
                        `${APP_URL}/api/v1/chat/${selectedUser._id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setMessages(response.data.messages);
                } catch (error) {
                    console.log("get chat error:", error);
                }
            };
            fetchMessages();
        }
    }, [selectedUser?._id]);

    // ✅ Real-time message listener
    useEffect(() => {
        const handleNewMessage = (newMessage: Message) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket?.on("newMessage", handleNewMessage);

        return () => {
            socket?.off("newMessage", handleNewMessage);
        };
    }, [socket]);

    return (
        <div className="flex flex-col flex-1">
            {/* Header */}
            <div className="p-3 bg-blue-800 text-white font-semibold flex justify-between items-center rounded-t-lg">
                <span>{selectedUser ? selectedUser.username : "Select a chat"}</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                    msg.senderId !== user?._id ? 
                    <div key={msg.senderId + msg.text} className="flex items-start space-x-2">
                        <div className="bg-gray-200 p-2 rounded-lg max-w-[75%]">
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div> 
                    : 
                    <div key={msg.senderId + msg.text} className="flex justify-end">
                        <div className="bg-blue-800 text-white p-2 rounded-lg max-w-[75%]">
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={handleText}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                <Button className="w-auto! px-4" onClick={() => selectedUser && handleSend(selectedUser._id)}>Send</Button>
            </div>
        </div>
    );
};

export default ChatWindow;
