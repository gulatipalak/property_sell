
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import "./App.css";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProperty from "./pages/dashboard/AddProperty";
import PropertiesList from "./pages/dashboard/PropertiesList";
import Unauthorized from "./pages/Unauthorized";
import ChatModule from "./pages/dashboard/ChatModule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup-tenant" element={<Signup/>}/>
        <Route path="/signup-landlord" element={<Signup/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/forget-password" element={<ForgetPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["landlord","tenant"]}><Dashboard/></ProtectedRoute>}/>
        <Route path="/properties/property/:type" element={<ProtectedRoute allowedRoles={["landlord"]}><AddProperty/></ProtectedRoute>}/>
        <Route path="/properties/property/:type/:propertyid" element={<ProtectedRoute allowedRoles={["landlord"]}><AddProperty/></ProtectedRoute>}/>
        <Route path="/properties" element={<ProtectedRoute allowedRoles={["landlord","tenant"]}><PropertiesList/></ProtectedRoute>}/>
        <Route path="/chat/:userid" element={<ProtectedRoute allowedRoles={["landlord","tenant"]}><ChatModule/></ProtectedRoute>}/>
        <Route path="/chats" element={<ProtectedRoute allowedRoles={["landlord","tenant"]}><ChatModule/></ProtectedRoute>}/>
      </Routes>
    </Router>
  )
}

export default App
