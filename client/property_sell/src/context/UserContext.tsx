import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD
import { APP_URL } from "../global_variables";
=======
import { APP_URL } from "../app_url";
import { io, Socket } from "socket.io-client";
>>>>>>> 07442cb6c93370ebb1a11430a48dbbded96986b4

// Define User Type
interface User {
    _id: string;
    username: string;
    role: string;
    email: string;
    profile_photo: string | File | null;
}

// Define Context Type
interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    socket: Socket | null; 
    token: string | null;
}

// ✅ Provide a default empty object to prevent `undefined` errors
export const UserContext = createContext<UserContextType | null>(null);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const token = sessionStorage.getItem("token");

    useEffect(() => {   
        const fetchUser = async () => {
            try {
                
                if (!token) return;
    
                const response = await axios.get(`${APP_URL}/api/v1/user/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data.data);
                console.log("Console get profile response: ",response.data.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUser();
    }, [token]);

    
    useEffect(() => {
        // ✅ Establish WebSocket connection when user is logged in
        // console.log("Console get profile 1: ",user);
        if (user) {
        
            const socket = io(APP_URL);
            
            setSocket(socket);

            socket.emit("user-login", user._id, user.username);

            socket.emit("join", user._id);

            socket.on("user-login", () => {
                console.log("Connected to WebSocket:", socket.id);
                console.log("Connected to User id:", user._id, user.username);
            });

            return () => {
                socket.emit("user-disconnect", user._id, user.username);
            };
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, socket, token}}>
            {children}
        </UserContext.Provider>
    );
};

// ✅ Create a Custom Hook for using the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};