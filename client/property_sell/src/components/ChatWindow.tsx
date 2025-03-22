import Button from "./Button";

interface ChatWindowProps {
    selectedUser: {
        id: string;
        username: string;
        avatarUrl?: string;
        lastMessage?: string;
    } | null;
    }
      

const ChatWindow = ({ selectedUser }: ChatWindowProps) => {
        return(
            <div className="flex flex-col flex-1">
                    {/* Header */}
                    <div className="p-3 bg-blue-800 text-white font-semibold flex justify-between items-center rounded-t-lg">
                        <span>{selectedUser ? selectedUser.username : "Select a chat"}</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="bg-gray-200 p-2 rounded-lg max-w-[75%]">
                                <p className="text-sm">Hello! Are you interested in this property?</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-blue-800 text-white p-2 rounded-lg max-w-[75%]">
                                <p className="text-sm">Yes! Is it available for immediate move-in?</p>
                            </div>
                        </div>
                    </div>

                    {/* Input Box */}
                    <div className="p-3 border-t flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                        <Button className="w-auto! px-4">Send</Button>
                    </div>
                </div>
        )
}

export default ChatWindow;