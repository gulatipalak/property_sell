import {Link, useNavigate} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";
import { useEffect, useState } from "react";
import {toast} from "react-toastify";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { APP_URL } from "../../app_url";
import AuthLayout from "../../layouts/AuthLayout";
import ReactPasswordChecklist from "react-password-checklist";

const Signup = () => {
    const [formData,setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        license_number: '',
        role: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [isTenant, setIsTenant] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // useEffect(() => {
    //     if (location.pathname.includes("tenant")){
    //         setFormData({...formData,role: "tenant"});
    //         setIsTenant(true);
    //     } else if (location.pathname.includes("landlord")){
    //         setFormData({...formData,role: "landlord"});
    //         setIsTenant(false);
    //     }
    // }, [location.pathname]);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            role: location.pathname.includes("tenant") ? "tenant" : "landlord"
        }));
        setIsTenant(location.pathname.includes("tenant"));
    }, [location.pathname]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData ( {
        ...formData,
        [e.target.name]:e.target.value,
    })};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.username || !formData.email || !formData.password || !formData.confirm_password) {
            toast.error("Please fill all the fields");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirm_password) {
            toast.error("Password and Confirm password should be same");
            setLoading(false);
            return;
        }

        if(!emailPattern.test(formData.email)){
            toast.error("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if(!isTenant && !formData.license_number) {
            toast.error("License number is required for landlords");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${APP_URL}/api/v1/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if(response.ok) {
                toast.success(data.message || "Signup Successful!");
                console.log("Response Data: ", data);
                setTimeout(() => navigate("/verify-email",{ state: { email: data.email, flowType: "signup"}}),3000);
            } else {
                toast.error(data.message || "Signup failed!");
            }

        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <AuthLayout>
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Sign up as { isTenant ? "tenant" : "landlord"}</h2>
                <form onSubmit={handleSubmit} method="post">
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
                    <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    name="email"
                    value= {formData.email}
                    onChange={handleChange}
                    />
                </div>
                { !(isTenant) && 
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">License Number</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your license number"
                    name="license_number"
                    value= {formData.license_number}
                    onChange={handleChange}
                    />
                </div>
                }
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder= "Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                    <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder= "Enter confirm password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                />
                    <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                    </div>
                </div>
                <ReactPasswordChecklist 
                    rules={["minLength","specialChar","number","capital","match"]}
                    minLength={5}
                    value={formData.password}
                    valueAgain={formData.confirm_password}
                />
                <button type="submit" className="w-full bg-blue-800 text-white py-2 hover:bg-blue-700 transition rounded-md disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                {loading ? <ClipLoader color="#ffffff" size={19}/> : "Sign Up"} 
                </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                Already have an account? <Link to="/Login" className="text-blue-800 font-semibold">Login</Link>
                </p>
            </AuthLayout>
        </>
    );
};

export default Signup;