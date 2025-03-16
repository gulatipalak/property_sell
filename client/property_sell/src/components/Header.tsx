
import {  useContext } from "react";

import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
    const context = useContext(UserContext) ?? { user: null, setUser: () => {} };
    const { user, setUser } = context;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out Successfully!");
        setUser(null);
        setTimeout( () => {navigate("/login")},3000);
    }
    return (
        <>
        <ToastContainer/>
        <div className="flex items-center gap-4 justify-end bg-blue-800 pr-6 py-4">
            <div className="font-medium text-white">{user?.username ?? "Guest"}</div>
            <button
                onClick={handleLogout}
                className="bg-blue-900 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition"
            >
                Logout
            </button> 
        </div>
        </>
    )
}

export default Header;