import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const context = useContext(UserContext);

    if (!token) return <Navigate to="/login" />; // Redirect if no token

    if (!context || !context.user) return <Navigate to="/unauthorized" />; // Redirect if user context is unavailable

    const { user } = context;

    return allowedRoles.includes(user.role) ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
