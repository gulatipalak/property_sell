import { Link, useLocation} from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const menuItems = [
      { label: "Dashboard", path: "dashboard" },
      { label: "Properties", path: "properties" },
      { label: "Chats", path: "chats" },
      { label: "My Account", path: "my-account" } // Change label but keep path intact
  ];
    return (
      <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-[24px] font-bold">Property Bazaar</div>
      <nav className="sidebar-menu flex-1">
        <ul>
          {menuItems.map((item,index) => (
            <li key={index} className={`hover:bg-blue-900 transition-all duration-300 ${location.pathname.startsWith(`/${item}`) ? "active" : ""}`}>
            <Link to={`/${item}`} className="block capitalize px-[20px] py-[10px]">{item.label}</Link>
          </li>
           ))}
        </ul>
      </nav>
    </div>
    )
}

export default Sidebar;