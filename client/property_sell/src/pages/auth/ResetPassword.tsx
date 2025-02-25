import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return(
        <>
        <div className="min-h-screen auth-bg-image flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] sm:w-[600px]">
                <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Reset Password
                </h2>
                <p className="text-gray-600 text-center mb-4">
                Enter a new password for your account
                </p>

                {/* New Password Input */}
                <div className="mb-4">
                <label className="block text-gray-700 font-medium">New Password</label>
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    placeholder="Enter new password"
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
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                      </button>
                    
                </div>
                
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Reset Password
                </button>

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

export default ResetPassword;