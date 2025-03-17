import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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
    const token = localStorage.getItem("token");

    useEffect(() => {   
        const fetchUser = async () => {
            try {
                
                if (!token) return;
    
                const response = await axios.get(`${APP_URL}/api/v1/user/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
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