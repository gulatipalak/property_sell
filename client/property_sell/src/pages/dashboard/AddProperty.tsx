import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PanelLayout from "../../layouts/PanelLayout";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { APP_URL } from "../../app_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { X } from "lucide-react";

const AddProperty = () => {
    const {type,propertyid} = useParams();
    const [selectedImage,setSelectedImage] = useState("");
    // console.log("selectedImage:",selectedImage);

    const [isEdit, setIsEdit] = useState(false);

    useEffect(()=>{
        setIsEdit(type === 'edit');
    },[type]);

    const [formData, setFormData] = useState({
        property_name: '',
        postingFor: 'Sell',
        type: 'Apartment',
        area: '',
        bedrooms: '',
        bathrooms: '',
        furnished: 'Fully Furnished',
        amenities: '',
        contact: '',
        location: '',
        price: '',
        image:  null as string | File | null,
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log ("files" ,e.target.files);
        if (!e.target.files || e.target.files.length === 0) {
           console.log("No file selected");
           return;
       }
   
        const file = e.target.files[0];
   
        setFormData((prevFormData)=>({
           ...prevFormData,
           image: file
        }));
   
        setSelectedImage(URL.createObjectURL(file));
       }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const {property_name, postingFor, type, area, bedrooms, bathrooms, furnished, amenities, contact, location, price, image} = formData;

        if(!property_name || !postingFor || !area || !price || !contact ) {
            toast.error("Please Fill All Required Fields.");
            setIsLoading(false);
            return;
        }

        // Create a FormData object
        const formDataToSend = new FormData();
        formDataToSend.append("property_name", property_name);
        formDataToSend.append("postingFor", postingFor);
        formDataToSend.append("type", type);
        formDataToSend.append("area", area);
        formDataToSend.append("bedrooms", bedrooms);
        formDataToSend.append("bathrooms", bathrooms);
        formDataToSend.append("furnished", furnished);
        formDataToSend.append("amenities", amenities);
        formDataToSend.append("contact", contact);
        formDataToSend.append("location", location);
        formDataToSend.append("price", price);
        
        if(image) {
            formDataToSend.append("image", image);
        }

        if (isEdit) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    return;
                }

                const response = await axios.patch(`${APP_URL}/api/v1/user/landlord/update-property`,formDataToSend,
                    {headers:{Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data"}
                });
                
                toast.success(response.data.message || "Property Updated Sucessfully!");
                setFormData(response.data.data.property);
                
                setTimeout( () => {
                navigate("/properties")
                setIsLoading(false)},3000);
            }
            catch(error: unknown) {
                if(axios.isAxiosError(error)) {
                    if(error.response?.status === 400) {
                        console.log(error.response.data.message);
                        setIsLoading(false);
                    }
                }
                else {
                    console.error("Error:", error);
                    toast.error("Something went wrong. Please try again.");
                    setIsLoading(false);
                }
                
            }
        } else {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    return;
                }
                //                 console.log("Checking FormData:");
                // for (const pair of formDataToSend.entries()) {
                //     console.log(`${pair[0]}:`, pair[1]); // Logs key-value pairs
                // }

                const response = await axios.post(`${APP_URL}/api/v1/user/landlord/add-property`,formDataToSend,
                    {headers:{Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data"}
                });
                toast.success(response.data.message || "Property Added Sucessfully!");
                
                setTimeout( () => {
                    navigate("/properties")
                    setIsLoading(false);},3000);
            }
            catch(error) {
                console.error("Error:", error);
                toast.error("Something went wrong. Please try again.");
                setIsLoading(false);
            }
        }
    }

    useEffect( () => {
        const fetchProperty = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                toast.error("Authentication error! Please log in.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`${APP_URL}/api/v1/user/landlord/get-property/${propertyid}`,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                setFormData(response.data.data.property);
                //console.log(response.data.data.property)
            }
            catch(error:unknown) {
                if(axios.isAxiosError(error)){
                    if(error.response?.status === 404){
                        console.log("Property doesn't exists");
                    }
                }else {
                    console.log("Something went wrong,Please try again later");
                }
            }
        }
        fetchProperty();
    },[propertyid, navigate]);

    const removeImage = () => {
        setFormData((prev)=>({
            ...prev,
            image:null
        })
        )
        setSelectedImage("");
    }

    console.log("image URL",formData.image);
    return (
        <>
            <PanelLayout>
            <ToastContainer/>
            <div className="">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
                    {type?.charAt(0).toUpperCase() + (type?.slice(1) || "")} New Property
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <label className="block text-gray-700 font-medium">Property Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="property_name"
                            value = {formData.property_name}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter property name"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-medium">Posting Property For <span className="text-red-500">*</span></label>
                        <select
                            name="postingFor"
                            value = {formData.postingFor}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        >
                            <option value="Sell">Sell</option>
                            <option value="Rent">Rent</option>
                        </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Property Type</label>
                    <select
                        name="type"
                        value = {formData.type}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                    >
                        <option value="">Select Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Shop">Shop</option>
                        <option value="Office">Office</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Area (sq. ft.) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        name="area"
                        value = {formData.area}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Enter Area"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Bedrooms</label>
                    <input
                        type="number"
                        name="bedrooms"
                        value = {formData.bedrooms}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Enter Number of Bedrooms"
                    />  
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Bathrooms</label>
                    <input
                        type="number"
                        name="bathrooms"
                        value = {formData.bathrooms}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Enter Number of Bathrooms"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Furnished</label>
                    <select
                        name="furnished"
                        value = {formData.furnished}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
                        <option value="">Select Type</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Amenities</label>
                    <input
                        type="text"
                        name="amenities"
                        value = {formData.amenities}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Enter Amenities [Gym, Parking, Swimming Pool]"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Location</label>
                    <input
                        type="text"
                        name="location"
                        value = {formData.location}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Enter location"
                    />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Price <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="price"
                            value = {formData.price}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter price"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Contact <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="contact"
                            value = {formData.contact}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter Contact Number"
                        />
                    </div>

                    

                    {selectedImage ?
                        <div className="relative inline-block">
                            <img src = {selectedImage} alt="preview" className="h-40 object-contain"/>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        : <label
                        htmlFor="uploadImage"
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                    >
                        <span className="text-gray-500">Click to Upload</span>
                        <input
                            type="file"
                            id="uploadImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>}
                    {/* <img src = {formData.image}  alt="preview" className="h-40 object-contain"/> */}
                    
                    <Button type="submit" disabled = {isLoading}>{isLoading ? <ClipLoader color="white" size={19}/> : isEdit ? "Update Property" : "Add Property"}</Button>
                </form>
            </div>
            </PanelLayout>
            
        </>
    )
}

export default AddProperty;