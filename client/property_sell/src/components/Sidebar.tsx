import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
      <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-[24px] font-bold">Property Bazaar</div>
      <nav className="flex-1">
        <ul>
          <li className="px-[20px] py-[10px] hover:bg-blue-800 transition">
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </div>
    )
}

export default Sidebar;