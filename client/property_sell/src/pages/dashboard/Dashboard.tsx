import { Link } from "react-router-dom";
import PanelLayout from "../../layouts/PanelLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_URL } from "../../app_url";

const Dashboard = () => {
    const [username, setUsername] = useState("");

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
    return (
        <>  
            <PanelLayout>
                <div className="flex items-center justify-center h-100">
                    <div className="text-center">
                        <h2 className="mb-4 font-bold text-blue-900 text-xl">Hey {username}, Welcome to Property Bazaar!</h2>
                        <Link to="/add-property" className="bg-blue-900 text-white rounded-sm px-7 py-2 inline-block">Add Property</Link>
                    </div>
                </div>
            </PanelLayout>
        </>
    )
}

export default Dashboard;