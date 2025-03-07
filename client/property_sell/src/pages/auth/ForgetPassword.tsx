import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios";
import { APP_URL } from "../../app_url";



const ForgetPassword = () => {
    const [email, setEmail] = useState("");

    const [loading,setLoading] = useState(false);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            toast.error("Please enter your email address");
            setTimeout(()=>setLoading(false),5000);
            return;
        }

        if (!emailPattern.test(email)) {
            toast.error("Please enter valid email address");
            setTimeout(()=>setLoading(false),5000);
            return;
        }

        try {
            const response = await axios.post(`${APP_URL}/api/v1/user/forget-password`, {email: email});
            toast.success(response.data.message || "OTP sent. Please check your email.");
            setTimeout(()=> navigate("/verify-email",{state: {email: response.data.email, flowType: "forget-password"}}),1000);
            setLoading(false);
        } catch (error: unknown) {
            if(axios.isAxiosError(error)){
                if(error.response?.status == 200) {
                    toast.error(error.response?.data.message || "Email doesn't exists. Please try another email");
                }
                else {
                    toast.error(error.response?.data.message || "Failed to send email.");
                }
            }
            else {
                toast.error("Something went wrong. Please try again later.");
            }
            setLoading(false);
        }
    }


    // console.log(formData);

    return (
        <>
        <AuthLayout>
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Forget Password
                </h2>
                <p className="text-gray-600 text-center mb-4">
                Enter your email to receive an OTP
                </p>

                <form onSubmit={handleSubmit} method="post">
                    {/* Email Input */}
                    <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter your email"
                            name = "email"
                            value = {email}
                            onChange = {(e) => setEmail (e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                        {loading ? <ClipLoader color="#ffffff" size={19}/> : "Send OTP"}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-800 font-semibold">
                        Back to Login
                    </Link>
                </div>
        </AuthLayout>
        </>
    )
}

export default ForgetPassword;