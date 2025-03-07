import { Link, useLocation} from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
  
    return (
      <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-[24px] font-bold">Property Bazaar</div>
      <nav className="sidebar-menu flex-1">
        <ul>
          <li className={`px-[20px] py-[10px] hover:bg-blue-900 transition-all duration-300 ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <Link to="/dashboard" className="block">Dashboard</Link>
          </li>
          <li className={`px-[20px] py-[10px] hover:bg-blue-900 transition-all duration-300 ${location.pathname === "/properties" ? "active" : ""}`}>
            <Link to="/properties"
            className="block">Properties</Link>
          </li>
        </ul>
      </nav>
    </div>
    )
}

export default Sidebar;