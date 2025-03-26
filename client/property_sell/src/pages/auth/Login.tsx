import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios";
import { APP_URL } from "../../app_url";
import {requestNotificationPermission} from "../../firebase";
import Button from "../../components/Button";
import { useUser } from "../../context/UserContext";

const Login = () => {
    const [formData,setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const navigate = useNavigate();
    const { setUser } = useUser();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]:e.target.value,
      });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      if (!formData.email || !formData.password) {
        toast.error("Please enter email and password");
        setTimeout(() => setLoading(false), 5000); 
        return;
      }

      if (!emailPattern.test(formData.email)){
        toast.error("Please enter a valid email address");
        setTimeout(() => setLoading(false), 5000);
        return;
      }

      if (formData.email === formData.password) {
        toast.error("Email and password cannot be the same");
        setTimeout(() => setLoading(false), 5000);
        return;
      }

      try {
        const response = await axios.post(`${APP_URL}/api/v1/user/login`,formData);
        sessionStorage.setItem("token",response.data.token);
        setUser(response.data.data);
        requestNotificationPermission();
        navigate("/dashboard");
        setLoading(false);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)){
          if(error.response?.data.code == 400) {
            toast.error(error.response.data.message || "Invalid Credentials.");
          }
          else if(error.response?.data.code == 'EMAIL_NOT_VERIFIED') {
            toast.success(error.response.data.message || "Verify Your email.");
            navigate("/verify-email",{ state: { email: error.response.data.email,flowType: "signup" }});
          }
        }
        else {
          toast.error("Invalid Credentials");
        }
        setLoading(false);
      }
    }

    return (
      <>
       <AuthLayout>
       <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Login</h2>
              <form onSubmit={handleSubmit} method="post">
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
                      <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium">Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                      <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 pr-10"
                      placeholder= "Enter your password"
                      name="password"
                      value= {formData.password}
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
                  {/* <button type="submit" className="w-full bg-blue-800 text-white py-2 hover:bg-blue-700 transition rounded-sm disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                     {loading ? <ClipLoader color="#ffffff" size={19}/> : "Login"} 
                  </button> */}
                  <Button type="submit" disabled={loading}>{loading ? <ClipLoader color="#ffffff" size={19}/> : "Login"}</Button>
              </form>
              {/* Forgot Password Link */}
              <div className="flex justify-center mt-4">
                <Link to="/forget-password" className="text-blue-800 font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="flex justify-around mt-4">
                <Link to="/signup-tenant" className="text-blue-800 font-semibold">Sign up as a Tenant</Link>
                <Link to="/signup-landlord" className="text-blue-800 font-semibold">Sign up as a Landlord</Link>
              </div>
       </AuthLayout>
      </>
    );
  };
  
  export default Login;
  