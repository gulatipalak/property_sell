import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AuthLayout from "../../components/AuthLayout";
import axios from "axios";
import { APP_URL } from "../../app_url";


const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData,setFormData] = useState ({
        password: '',
        confirmPassword: ''
    })
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const email = location.state.email || "No email found";
    // console.log(email);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData ({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);       
        const {password, confirmPassword} = formData;

        if (!password || !confirmPassword) {
            toast.error("Please fill all the fields.");
            setTimeout(()=>setLoading(false),5000);
            return;
        }

        if(password !== confirmPassword) {
            toast.error("Confirm password must be same as password.");
            setTimeout(()=>setLoading(false),5000);
            return;
        }

        try {
            const response = await axios.post(`${APP_URL}/api/v1/user/reset-password`,{email, password});
            console.log (email);
            // console.log (response);
            toast.success(response.data.message || "Password reset successfully! Please login.");
            setTimeout(()=> {
                navigate("/login");
            },3000);
            setLoading(false);

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if(error.response?.status == 400) {
                    toast.error(error.response.data.message || "User not found");
                }
            }
            else {
                toast.error("Something went wrong. Please try again later.")
            }
            setLoading(false);
        }
    }

    return(
        <>
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Reset Password</h2>
            <p className="text-gray-600 text-center mb-4">
            Enter a new password for your account
            </p>

            <form onSubmit={handleSubmit}>
                {/* New Password Input */}
                <div className="mb-4">
                <label className="block text-gray-700 font-medium">New Password</label>
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    placeholder="Enter new password"
                    name= "password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                      </button>
                </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4">
                <label className="block text-gray-700 font-medium">Confirm Password</label>
                <div className="relative">
                    <input
                        type= {showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Confirm new password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                      </button>
                    
                </div>
                
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? <ClipLoader color="#ffffff" size={19}/> : "Reset Password"}
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

export default ResetPassword;