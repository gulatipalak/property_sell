import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../pages/auth/auth.css";


interface AuthLayoutProps {
    children: ReactNode;
}
const AuthLayout = ({children}:AuthLayoutProps) => {
 return(
    <>
    <ToastContainer/>
        <div className="min-h-screen auth-bg-image flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] sm:w-[600px]">
                {children}
            </div>
        </div>
    </>
 )
}

export default AuthLayout;