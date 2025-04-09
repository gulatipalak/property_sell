import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { APP_URL, default_profile_photo } from "../global_variables";
import axios from "axios";

const Header = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const {token} = useUser();

    const handleLogout = async () => {

        if (token) {
            try {
              await axios.post(`${APP_URL}/api/v1/user/remove-device-token`, {}, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            } catch (error) {
              console.error("Error removing device token:", error);
            }
          }
        sessionStorage.removeItem("token");
        toast.success("Logged out Successfully!");
        setUser(null);
        setTimeout( () => {navigate("/login")},3000);
    }
    console.log("profile_photo",user?.profile_photo);
    return (
        <>
        <ToastContainer/>
        <div className="flex items-center gap-4 justify-end bg-blue-800 pr-6 py-4">
            <div className="flex items-center gap-2">
                <div className="w-[32px] h-[32px] rounded-full bg-gray-700">
                    <img src={typeof user?.profile_photo == "string" ? user.profile_photo : default_profile_photo} className="rounded-full w-full h-full" alt="profile-photo" />
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