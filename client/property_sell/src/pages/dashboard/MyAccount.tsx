import React, { useState } from "react";
import Button from "../../components/Button";
import PanelLayout from "../../layouts/PanelLayout";
import { useUser } from "../../context/UserContext";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { APP_URL } from "../../app_url";

const MyAccount= () => {
    const [disabled, setdisabled] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const {user,setUser} = useUser();
    const [formData, setFormData] = useState({
        username: user?.username,
        email: user?.email,
    })
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleEdit = () => {
        setdisabled(false);
        setIsEdit(true);    
    }
    const handleCancle = () => {
        setFormData({
            username: user?.username,
            email: user?.email,
        })
        setIsEdit(false);
        setdisabled(true);
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const {username, email} = formData;
        const token = localStorage.getItem("token");
        
        if(!username?.trim() || !email?.trim()) {
            toast.error("All Field are Required");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.patch(`${APP_URL}/api/v1/user/update-profile`,formData,{
                headers:{Authorization:`Bearer ${token}`}
            })
            toast.success("Profile Updated Successfully!");
            setUser(response.data.data);
        }
        catch(error:unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            } else {
                toast.error("Something went wrong!");
            }
        }
        finally{
            setIsLoading(false);
            setIsEdit(false);
            setdisabled(true);
        }
    }

    return (
        <>
        <PanelLayout>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-blue-800 text-center leading-[40px]">Profile Details</h2>
            <Button type="button" className={`w-auto! ${isEdit && "hidden"}`} onClick={handleEdit}>Edit</Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-gray-400 disabled:text-gray-600"
                value= {formData.username}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled = {disabled}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-gray-400 disabled:text-gray-600"
                placeholder="Enter your email"
                value= {formData.email}
                onChange={handleChange}
                disabled = {disabled}
              />
            </div>
            {isEdit && (
                <div className="flex items-center justify-end gap-3">
                    <Button type="button" className="bg-red-500 hover:bg-red-600 w-auto!" onClick={handleCancle}>Cancel</Button>
                    <Button type="submit" className="w-auto! min-w-[83.75px]" disabled={isLoading}>
                        {isLoading ? <ClipLoader color="white" size={19}></ClipLoader> : "Update"}</Button>
                </div>
            )}
        </form>
        </PanelLayout>
        
        </>
    );
}

export default MyAccount;