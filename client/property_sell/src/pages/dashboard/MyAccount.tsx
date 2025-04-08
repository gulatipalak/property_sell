import React, { useState } from "react";
import Button from "../../components/Button";
import PanelLayout from "../../layouts/PanelLayout";
import { useUser } from "../../context/UserContext";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { APP_URL, default_profile_photo } from "../../global_variables";

const MyAccount= () => {
    const [disabled, setdisabled] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const {user,setUser} = useUser();
    const [formData, setFormData] = useState({
        username: user?.username,
        email: user?.email,
        profile_photo: user?.profile_photo,
    })
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const [selectedImage, setSelectedImage] = useState("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("files", e.target.files);

        if (!e.target.files || e.target.files.length === 0){
            console.log("No file is selected");
            return;
        }
        
        const file = e.target.files[0];

        setFormData((prevFormData) => ({
            ...prevFormData,
            profile_photo: file,
          }));

        setSelectedImage(URL.createObjectURL(file));
    }
    const handleEdit = () => {
        setdisabled(false);
        setIsEdit(true);    
    }
    const handleCancle = () => {
        setFormData({
            username: user?.username,
            email: user?.email,
            profile_photo: user?.profile_photo
        })
        setIsEdit(false);
        setdisabled(true);
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

<<<<<<< HEAD
        const {username, email, profile_photo} = formData;
        const token = localStorage.getItem("token");
=======
        const {username, email} = formData;
        const token = sessionStorage.getItem("token");
>>>>>>> 07442cb6c93370ebb1a11430a48dbbded96986b4
        
        if(!username?.trim() || !email?.trim()) {
            toast.error("All Field are Required");
            setIsLoading(false);
            return;
        }

        console.log("profile_photo",profile_photo);

        const formDataToSend = new FormData();

        formDataToSend.append("username",username);
        formDataToSend.append("email", email);
        if(!profile_photo) {
            formDataToSend.append("profile_photo", profile_photo ?? "");
        }
        

        console.log("Checking FormData:");
        for (const pair of formDataToSend.entries()) {
            console.log(`${pair[0]}:`, pair[1]); // Logs key-value pairs
        }

        try {
            const response = await axios.patch(`${APP_URL}/api/v1/user/update-profile`,formDataToSend,{
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
            <Button type="button" className={`w-auto! transition-all duration-300 ${isEdit && "hidden"}`} onClick={handleEdit}>Edit</Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="flex flex-col items-center space-y-4">
                {/* Image Preview (Default or Uploaded) */}
                <label htmlFor="uploadImage" className={`relative cursor-pointer ${disabled && "cursor-default"}`}>
                    <img
                        src= {selectedImage ? selectedImage : typeof formData.profile_photo === "string" ? formData.profile_photo : default_profile_photo}
                        alt="Profile"
                        className={`w-24 h-24 rounded-full border-4 border-blue-800 object-cover transition-all ${disabled && "cursor-default"}`}
                    />
                    <div className={`absolute bottom-0 right-0 bg-blue-800 text-white text-xs px-2 py-1 rounded-full transition-all ${disabled && "hidden"}`}>
                        Edit
                    </div>
                </label>

                {/* File Upload Input (Hidden) */}
                <input
                    type="file"
                    id="uploadImage"
                    name="profile_photo"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={disabled}
                />
            </div>
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-gray-400 disabled:text-gray-600"
                value= {formData.username}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled = {disabled}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-gray-400 disabled:text-gray-600"
                placeholder="Enter your email"
                value= {formData.email}
                onChange={handleChange}
                disabled = {disabled}
              />
            </div>
            {isEdit && (
                <div className="flex items-center justify-end gap-3 transition-all duration-300">
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