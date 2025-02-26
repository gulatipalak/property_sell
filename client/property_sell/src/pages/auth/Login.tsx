import "./auth.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
    const [formData,setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailPattern = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]:e.target.value,
      });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

      //alert(JSON.stringify(formData));
    }

    //console.log(formData);

    return (
      <>
        <ToastContainer/>
        <div className="min-h-screen auth-bg-image flex justify-center items-center flex-wrap">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] sm:w-[600px]">
              <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Login</h2>
              <form onSubmit={handleSubmit} method="post">
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium">Email</label>
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
                      <label className="block text-gray-700 font-medium">Password</label>
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
                  <button type="submit" className="w-full bg-blue-800 text-white py-2 hover:bg-blue-700 transition rounded-sm disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                     {loading ? "Logging you in .." : "Login"} 
                  </button>
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
          </div>
        </div>
      </>
    );
  };
  
  export default Login;
  