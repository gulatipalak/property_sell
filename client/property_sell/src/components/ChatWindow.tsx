import { toast } from "react-toastify";
import { APP_URL } from "../global_variables";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useUser } from "../context/UserContext";
import { debounce } from "lodash";

interface ChatWindowProps {
    selectedUser: {
        _id: string;
        username: string;
    } | null;
}

interface Message {
    _id:string;
    text: string;
    senderId: string;
    receiverId: string;
    isRead: boolean;
}

const ChatWindow = ({ selectedUser }: ChatWindowProps) => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const { user, socket } = useUser();
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState("");
    // const [isRead, setIsRead] = useState(false);

     // ✅ Debounce function to stop typing indicator
     const stopTyping =
            debounce(() => {
                socket?.emit("stop-typing",user?._id,selectedUser?._id); // Clear typing indicator after delay
            }, 2000);

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        socket?.emit("typing",user?._id,user?.username,selectedUser?._id);
        stopTyping();
    };

    const handleSend = async (selectedUserId: string) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error! Please log in.");
                return;
            }
            const response = await axios.post(
                `${APP_URL}/api/v1/chat/send-message/${selectedUserId}`,{text},{
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessages((prevMessages) => [...prevMessages, response.data.data]);
            // console.log(response.data.data);
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter" && selectedUser?._id){
            handleSend(selectedUser?._id)
        }
    }

    const fetchMessages = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error! Please log in.");
                return;
            }
            const response = await axios.get(
                `${APP_URL}/api/v1/chat/${selectedUser?._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessages(response.data.messages);
            socket?.emit("messages-read",user?._id,selectedUser?._id);
        } catch (error) {
            console.log("get chat error:", error);
        }
    };

    useEffect(() => {
        if (selectedUser?._id) {
            fetchMessages();
            socket?.on("newMessage", (newMessage) => {
                console.log("newMessage");
                if (newMessage.senderId === selectedUser?._id) {
                    // ✅ Update the chat only if the sender matches the currently selected user
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            });
            socket?.on("typing", (typingUserId,typingUsername) => {
                console.log("typing");
                if(typingUserId === selectedUser?._id){
                    setIsTyping(`${typingUsername} is typing...`);
                }
            })
            socket?.on("stopped-typing",(typingUserId) => {
                console.log("stopped-typing");
                if(typingUserId === selectedUser?._id){
                setIsTyping("");
                }
            });
            // socket?.on("read-marked", (readerId) => {
            //     console.log("readerId",readerId);
            //     if(readerId === selectedUser?._id) {
            //         fetchMessages();
            //     }
            // });
        }
        return () => {
            socket?.off("newMessage");
            socket?.off("typing");
            socket?.off("messages-read");
            socket?.off("read-marked");
        };
    }, [selectedUser?._id]);

    useEffect(()=>{
        if(chatWindowRef.current){
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    },[messages,isTyping]);


    return (
        <div className="flex flex-col flex-1">
            {/* Header */}
            <div className="p-3 bg-blue-800 text-white font-semibold flex justify-between items-center rounded-t-lg">
                <span>{selectedUser ? selectedUser.username : "Select a chat"}</span>
            </div>

            {/* Chat Messages */}
            <div ref={chatWindowRef} className="flex-1 p-3 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex  space-x-2 ${msg.senderId !== user?._id ? "items-start" : "justify-end" }`}>
                        <div className={` p-2 rounded-lg max-w-[75%] ${msg.senderId !== user?._id ? "bg-gray-200" : "bg-blue-800 text-white" }`}>
                            <p className="text-sm">{msg.text}</p>
                            {msg.senderId == user?._id &&
                                <div className={`${msg.isRead ? "text-green-600" : "text-red-500"}`}>{msg.isRead ? "seen" : "unseen"}</div>
                            }
                        </div>
                    </div>
                ))}
                {isTyping}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={handleText}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                    onKeyDown={handleKeyPress}
                />
                <Button className="w-auto! px-4" onClick={() => selectedUser && handleSend(selectedUser._id)} disabled={text.trim() == ""}>Send</Button>
            </div>
        </div>
    );
};

export default ChatWindow;
