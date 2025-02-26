import { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const ForgetPassword = () => {
    const [formData, setFormData] = useState(
        {
            email : ''
        }
    );

    const [loading,setLoading] = useState(false);

    const emailPattern = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.email) {
            toast.error("Please enter your email address");
            setTimeout(()=>setLoading(false),5000);
            return;
        }

        if (!emailPattern.test(formData.email)) {
            toast.error("Please enter valid email address");
            setTimeout(()=>setLoading(false),5000);
            return;
        }
    }


    // console.log(formData);

    return (
        <>
        <ToastContainer/>
        <div className="min-h-screen auth-bg-image flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] sm:w-[600px]">
                <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Forget Password
                </h2>
                <p className="text-gray-600 text-center mb-4">
                Enter your email to receive an OTP
                </p>

                <form onSubmit={handleSubmit} method="post">
                    {/* Email Input */}
                    <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter your email"
                            name = "email"
                            value = {formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                        {loading ? "Sending OTP" : "Send OTP"}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-800 font-semibold">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default ForgetPassword;