import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { APP_URL } from "../../app_url";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import { useUser } from "../../context/UserContext";

const VerifyEmail = () => {
    const [isResendDisabled,setIsResendDisabled] = useState(true);
    const [timer, setTimer] = useState(30);
    const [otp, setOtp] = useState("");
    const [ isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {email, flowType} = location.state || "";
    const isNumeric = /^[0-9]+$/;
    const { setUser } = useUser();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!otp) {
            toast.error("Please enter OTP");
            setIsLoading(false);
            return;
        }

        
        if(!isNumeric.test(otp)){
            toast.error("Invalid OTP format");
            setIsLoading(false);
            return;
        }

        if (otp.length !== 4) {
            toast.error("OTP should be 4 digits");
            setIsLoading(false);
            return;
        }


        const formData = {
            email: email,
            otp: Number(otp)
        }


        try {
            const response = await axios.post(`${APP_URL}/api/v1/user/verify-otp`, formData);
            sessionStorage.setItem("token",response.data.token);
            localStorage.setItem("role", response.data.role);
            toast.success(response.data.message || "OTP Verified Successfully!");
            console.log("response:",response.data);
            if (flowType == "signup"){
                setTimeout(() =>  {
                    navigate ("/dashboard");
                    setUser(response.data);
                    localStorage.setItem("emailVerified","true");
                }, 1000);
            } else if (flowType == "forget-password"){
                setTimeout(() => navigate ("/reset-password",{state: {email: response.data.email}}), 1000);
            }
            // console.log("Response Data: ", response.data);

        } catch (error: unknown) {
            console.log("Error:", error);
            if (axios.isAxiosError(error)){
                if (error.response?.status === 400) {
                    toast.error(error.response.data.message || "Incorrect OTP");
                }
                else {
                    toast.error(error.response?.data.message || "OTP verification failed!");
                }
            } else {
                toast.error("Failed to verify OTP. Please try again.");
            }
            
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(timer > 0) {
            const interval = setInterval(()=> {
                setTimer((prev) => prev - 1);
            },1000);
            return () => clearInterval(interval);
        }
        else {
            setIsResendDisabled(false);
        }
    },[timer])
    const handleResendOTP = async () => {
        setOtp("");
        setIsResendDisabled(true);
        setTimer(30);
        
        try {
            const response = await axios.post(`${APP_URL}/api/v1/user/resend-otp`,{email: email});
            toast.success(response.data.message || "OTP Resend Successfully!");
        }
        catch (error:unknown) {
            if(axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    toast.error(error.response.data.message || "User not found");
                }
            }
            else {
                toast.error("Failed to resend OTP. Please try again after later");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <>
        <AuthLayout>
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Verify Email</h2>
                <p className="text-center text-gray-600 mb-4">Enter the 4-digit OTP sent to your email</p>
                <form onSubmit={handleSubmit} method="post">
                    <div className="flex justify-center">
                        <OTPInput 
                            value={otp} 
                            onChange = {setOtp}
                            numInputs={4}
                            renderInput = {(props) => <input{...props}/>}
                            // shouldAutoFocus = {true}
                            inputStyle={
                                {
                                    width:"60px",
                                    height:"60px",
                                    margin:"0 10px",
                                    padding:"8px",
                                    border:"1px solid #ccc",
                                    backgroundColor:"#fafafa",
                                    fontSize:"22px",
                                    textAlign:"center",
                                    outline:"none",
                                    marginBottom: "20px"
                                }
                            }
                            
                            />
                    </div>

                    <Button type="submit" disabled={isLoading}>{isLoading ? <ClipLoader color="#ffffff" size={19}/> : "Verify OTP" }</Button>
                </form>
                <div className="flex justify-between mt-4">
                    <button className="text-blue-800 font-semibold disabled:cursor-not-allowed disabled:opacity-50" disabled={isResendDisabled} onClick={handleResendOTP}>
                        {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                    </button>
                    <Link to="/login" className="text-blue-800 font-semibold">
                        Back to Login
                    </Link>
                </div>
        </AuthLayout>
        </>
    );
}

export default VerifyEmail;
