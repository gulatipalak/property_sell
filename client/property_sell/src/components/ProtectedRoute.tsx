import { ReactNode, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ClipLoader } from "react-spinners";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const context = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (context?.user) {
            setLoading(false);
        } else {
            // Simulate fetching user data (if needed)
            setTimeout(() => setLoading(false), 500);
        }
    }, [context?.user]);

    if (!token) return <Navigate to="/login" />; // Redirect if no token

    if (loading) return <div className="flex items-center justify-center h-screen bg-white"><ClipLoader color="blue"></ClipLoader></div>; // Prevent redirecting before user data loads

    if (!context?.user) return <Navigate to="/unauthorized" />; // Redirect if user data is unavailable

    return allowedRoles.includes(context.user.role) ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
