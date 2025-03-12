import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
    children: ReactNode;
    disabled?: boolean;
    type?:  "submit" | "reset" | "button" | undefined;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    to?: string;
    className?: string;
}

const Button = ({children, disabled = false, type, onClick, to, className}:ButtonProps) => {
    if(to) {
        return(
            <Link to={to} 
            className={`bg-blue-800 text-white hover:bg-blue-700 rounded-sm px-7 py-2 inline-block transition-all duration-300 ${className}`}
              >
               {children}
              </Link>
        )
    }
    return (
        <button onClick={onClick} type={type} className={`w-full bg-blue-800 text-white py-2 hover:bg-blue-700 transition rounded-sm disabled:opacity-70 disabled:cursor-not-allowed ${className}`} disabled={disabled}>
    {children}
    </button>
    );
}

export default Button;