import Button from "../../components/Button";
import PanelLayout from "../../layouts/PanelLayout";

const ChatModule = () => {
    return (
        <PanelLayout>
            <div className="flex h-[500px] w-full border rounded-lg shadow-lg bg-white">
                
                {/* Sidebar - Chat List */}
                <div className="w-1/4 border-r bg-gray-100 p-3 rounded-l-lg overflow-y-auto">
                    <h2 className="font-semibold text-lg mb-3">Chats</h2>
                    <ul className="space-y-2">
                        <li className="flex items-center p-2 rounded-lg shadow bg-white cursor-pointer hover:bg-gray-200 transition-all">
                            <img src="https://i.pravatar.cc/40?img=1" alt="User 1" className="w-10 h-10 rounded-full mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">User 1</span>
                                    <span className="text-xs text-gray-500">10:30 AM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 truncate max-w-[120px]">Hello! Are you interested?</span>
                                    <div className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full">2</div>
                                </div>
                            </div>
                        </li>
                        <li className="flex items-center p-2 rounded-lg shadow bg-white cursor-pointer hover:bg-gray-200 transition-all">
                            <img src="https://i.pravatar.cc/40?img=2" alt="User 2" className="w-10 h-10 rounded-full mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">User 2</span>
                                    <span className="text-xs text-gray-500">09:45 AM</span>
                                </div>
                                <span className="text-sm text-gray-600 truncate max-w-[120px]">Hey, I have a question...</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Main Chat Section */}
                <div className="flex flex-col flex-1">
                    {/* Header */}
                    <div className="p-3 bg-blue-800 text-white font-semibold flex justify-between items-center rounded-tr-lg">
                        <span>User 1</span>
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
            </div>
        </PanelLayout>
    );
}

export default ChatModule;
