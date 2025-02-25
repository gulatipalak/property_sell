import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

interface PasswordInputProps {
    placeholder?: string; // The '?' denotes that this prop is optional
  }

const PasswordInput:React.FC<PasswordInputProps>=({placeholder = "Enter your password"}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
             <input
        type={showPassword ? "text" : "password"}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        placeholder={placeholder}
        name="password"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
      </button>
        </div>
    );
};

export default PasswordInput;