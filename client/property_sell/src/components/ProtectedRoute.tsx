import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({children, allowedRoles}: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");

    if(!token) return <Navigate to="/login"/>
    const user = jwtDecode<{role: string}>(token);
    return (
        allowedRoles.includes(user.role) ? children : <Navigate to="/unauthorized"/>
    )
}

export default ProtectedRoute;