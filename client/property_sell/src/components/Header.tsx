import axios from "axios";
import { useState, useEffect } from "react";
import { APP_URL } from "../app_url";

const Header = () => {
    const [username, setUsername] = useState("")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                // console.log(token);
                const response = await axios.get(`${APP_URL}/api/v1/user/get-profile`, {
                    headers: {Authorization: `Bearer ${token}`}
                })
                console.log("Request Headers:", response.config.headers);
                setUsername(response.data.data.username);
            }
            catch (error){
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUser();
    },[]);
    return (
        <div className="flex justify-between items-center bg-blue-800 pr-6 py-4">
            <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{username || "Guest"}</span>
                </div>
            </div>
        </div>
    )
}

export default Header;