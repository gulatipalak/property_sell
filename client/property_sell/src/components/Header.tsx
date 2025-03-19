import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {
    const { user, setUser } = useUser();
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
            <div className="flex items-center gap-2">
                <div className="w-[32px] h-[32px] rounded-full bg-gray-700">
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <circle cx="12" cy="7" r="4" fill="#ccc"/>
                    <path
                        fill="#ccc"
                        d="M12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                    />
                    </svg>
                </div>
                <div className="font-medium text-white">{user?.username ?? "Guest"}</div>
            </div>
            
            <button
                onClick={handleLogout}
                className="bg-blue-900 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
                Logout
            </button> 
        </div>
        </>
    )
}

export default Header;