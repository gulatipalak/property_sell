import { Link, useNavigate } from "react-router-dom";
import PanelLayout from "../../layouts/PanelLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_URL } from "../../app_url";
import SuccessModal from "../../components/SuccessModal";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [showVerifiedSuccessModal, setVerifiedShowSuccessModal] =
    useState(false);
    


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication error! Please log in.");
          navigate("/login");
          return;
        }
        const response = await axios.get(`${APP_URL}/api/v1/user/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.data.username);
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const emailVerified = localStorage.getItem("emailVerified");

    if (emailVerified === "true") {
      setVerifiedShowSuccessModal(true);
      localStorage.removeItem("emailVerified"); // Remove it to prevent running on refresh
    }
  }, []);

  const token = localStorage.getItem("token");

  const user = jwtDecode<{ role: string }>(token ?? "");

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
            <h2 className="mb-4 font-bold text-gray-800 text-xl">
              Hey {username}, Welcome to Property Bazaar!
            </h2>
            {user.role === "landlord" ? (
              <Link
                to="/property/add"
                className="bg-blue-800 text-white hover:bg-blue-700 rounded-sm px-7 py-2 inline-block transition-all duration-300"
              >
                Add Property
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </PanelLayout>
    </>
  );
};

export default Dashboard;
