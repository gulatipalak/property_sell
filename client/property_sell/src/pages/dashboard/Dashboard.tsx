import { Link, useLocation } from "react-router-dom";
import PanelLayout from "../../layouts/PanelLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_URL } from "../../app_url";
import SuccessModal from "../../components/SuccessModal";


const Dashboard = () => {
    const [username, setUsername] = useState("");
    const location = useLocation();
    const [showVerifiedSuccessModal, setVerifiedShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${APP_URL}/api/v1/user/get-profile`,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                setUsername(response.data.data.username);
            }
            catch (error){
                console.error("Failed to fetch user data.", error);
            }
        }
        fetchUser();
    },[]);

    useEffect(() => {
        if (location.state?.emailVerified) {
            setVerifiedShowSuccessModal(true);
        }
      }, [Location]);

    return (
        <>  
            <PanelLayout>
                {showVerifiedSuccessModal && (
                    <SuccessModal
                    message="Your email has been successfully verified! Welcome to your dashboard."
                    onClose={() => setVerifiedShowSuccessModal(false)}
                    />
                )}
                <div className="flex items-center justify-center h-100">
                    <div className="text-center">
                        <h2 className="mb-4 font-bold text-gray-800 text-xl">Hey {username}, Welcome to Property Bazaar!</h2>
                        <Link to="/property/add" className="bg-blue-800 text-white hover:bg-blue-700 rounded-sm px-7 py-2 inline-block transition-all duration-300">Add Property</Link>
                    </div>
                </div>
            </PanelLayout>
        </>
    )
}

export default Dashboard;