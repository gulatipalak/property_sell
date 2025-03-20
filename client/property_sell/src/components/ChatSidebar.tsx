const ChatSidebar = () => {
    return (
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
    )
}

export default ChatSidebar;