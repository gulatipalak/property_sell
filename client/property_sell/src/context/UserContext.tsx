import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { APP_URL } from "../app_url";

// Define User Type
interface User {
    username: string;
    role: string;
}

// Define Context Type
interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// ✅ Provide a default empty object to prevent `undefined` errors
export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {   
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
    
                const response = await axios.get(`${APP_URL}/api/v1/user/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data.data);
                console.log("user",response.data.data);
                // console.log("user",user);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        console.log("Updated user state:", user); // ✅ Now logs updated state
    }, [user]); 

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};