import axios from "axios";
import { useState, useEffect } from "react";
import { APP_URL } from "../app_url";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.success("Logged out Successfully!");
        setTimeout( () => navigate("/login"),3000);
    }
    return (
        <>
        <ToastContainer/>
        <div className="flex justify-between items-center bg-blue-800 pr-6 py-4">
            <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{username || "Guest"}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-blue-900 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
        </>
    )
}

export default Header;