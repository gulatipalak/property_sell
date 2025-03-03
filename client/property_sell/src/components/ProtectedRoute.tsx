import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    return (
    <>
    {token ? children : <Navigate to="/login"/>}
    </>
    )
}

export default ProtectedRoute;