import { Link } from "react-router-dom";

const VerifyEmail = () => {
    return(
        <>
        <div className="min-h-screen auth-bg-image flex justify-center items-center flex-wrap">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] sm:w-[600px]">
                <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Verify Email</h2>
                <p className="text-center text-gray-600 mb-4">Enter the 4-digit OTP sent to your email</p>
                <form method="post">
                <div className="flex justify-center space-x-4 mb-4">
                    <input type="text" className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800" maxLength={1} />
                    <input type="text" className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800" maxLength={1} />
                    <input type="text" className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800" maxLength={1} />
                    <input type="text" className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800" maxLength={1} />
                </div>
                <button type="submit" className="w-full bg-blue-800 text-white py-2 hover:bg-blue-700 transition rounded-sm">
                    Verify OTP
                </button>
                </form>
                {/* Resend OTP & Back to Login */}
                <div className="flex justify-between mt-4">
                    <button className="text-blue-800 font-semibold">
                        Resend OTP
                    </button>
                    <Link to="/login" className="text-blue-800 font-semibold">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
        </>
    );
}

export default VerifyEmail;
