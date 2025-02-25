import "./auth.css";
import {Link} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";
import { useEffect, useState } from "react";
import {ToastContainer ,toast} from "react-toastify";
import { useLocation } from "react-router-dom";

const Signup = () => {
    const [formData,setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
        license_number: '',
        user_type: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [isTenant, setIsTenant] = useState(false);
    const location = useLocation();
    
    // useEffect(() => {
    //     if (location.pathname.includes("tenant")){
    //         setFormData({...formData,user_type: "tenant"});
    //         setIsTenant(true);
    //     } else if (location.pathname.includes("landlord")){
    //         setFormData({...formData,user_type: "landlord"});
    //         setIsTenant(false);
    //     }
    // }, [location.pathname]);
    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            user_type: location.pathname.includes("tenant") ? "tenant" : "landlord"
        }));
        setIsTenant(location.pathname.includes("tenant"));
    }, [location.pathname]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData ( {
        ...formData,
        [e.target.name]:e.target.value,
    })};

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
            setLoading(false);
            toast.error("Please fill all the fields");
           // setTimeout(() => setLoading(false),5000);
            return;
        }

        if (!(formData.password === formData.confirm_password)) {
            toast.error("Password and Confirm password should be same");
            setTimeout(() => setLoading(false),5000);
            return;
        }

        if(!emailPattern.test(formData.email)){
            toast.error("Please enter a valid email address");
            setTimeout(()=>setLoading(false),5000);
            return;
        }

        if(!isTenant && !formData.license_number) {
            toast.error("License number is required for landlords");
            setTimeout(() => setLoading(false),5000);
            return;
        }

        alert(JSON.stringify(formData));
    };
    console.log(formData);
    return (
        <>
            <ToastContainer/>
            <div className="min-h-screen auth-bg-image flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] sm:w-[600px]">
                    <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Sign up as { isTenant ? "tenant" : "landlord"}</h2>
                    <form onSubmit={handleSubmit} method="post">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Full Name</label>
                        <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Email</label>
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
                        <label className="block text-gray-700 font-medium">Password</label>
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
                        <label className="block text-gray-700 font-medium">Confirm Password</label>
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
                    <button type="submit" className="w-full bg-blue-800 text-white py-2 hover:bg-blue-700 transition rounded-md disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"} 
                    </button>
                    </form>
                    <p className="text-center text-gray-600 mt-4">
                    Already have an account? <Link to="/Login" className="text-blue-800 font-semibold">Login</Link>
                </p>
                </div>
            </div>
        </>
    );
};

export default Signup;