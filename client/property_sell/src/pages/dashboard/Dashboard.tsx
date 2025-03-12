import PanelLayout from "../../layouts/PanelLayout";
import { useContext, useEffect, useState } from "react";
import SuccessModal from "../../components/SuccessModal";
import Button from "../../components/Button";
import { UserContext } from "../../context/UserContext";

const Dashboard = () => {
  const context = useContext(UserContext) ?? {user: null, setUser: () => {} };

  const {user} = context;
  const [showVerifiedSuccessModal, setVerifiedShowSuccessModal] = useState(false);

  useEffect(() => {
    const emailVerified = localStorage.getItem("emailVerified");

    if (emailVerified === "true") {
      setVerifiedShowSuccessModal(true);
      localStorage.removeItem("emailVerified"); // Remove it to prevent running on refresh
    }
  }, []);

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
              Hey {user ? user.username : "Guest"}, Welcome to Property Bazaar!
            </h2>
            {user?.role === "landlord" ? 
              (<Button to="/property/add">Add Property</Button>): ""}
          </div>
        </div>
      </PanelLayout>
    </>
  );
};

export default Dashboard;
