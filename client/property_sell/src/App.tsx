
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup-tenant" element={<Signup/>}/>
        <Route path="/signup-landlord" element={<Signup/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/forget-password" element={<ForgetPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/add-property" element={<ProtectedRoute><AddProperty/></ProtectedRoute>}/>
        <Route path="/properties" element={<ProtectedRoute><PropertiesList/></ProtectedRoute>}/>
      </Routes>
    </Router>
  )
}

export default App
