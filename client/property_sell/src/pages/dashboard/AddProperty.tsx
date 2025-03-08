import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PanelLayout from "../../layouts/PanelLayout";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { APP_URL } from "../../app_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
    const {type,propertyid} = useParams();

    // console.log(type,propertyid,"type")
    //console.log(id,"id")

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
        price: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const {property_name, postingFor, area, contact, price} = formData;

        if(!property_name || !postingFor || !area || !price || !contact ) {
            toast.error("Please Fill All Required Fields.");
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error! Please log in.");
                return;
            }
            const response = await axios.post(`${APP_URL}/api/v1/user/landlord/add-property`,formData,
                {headers:{Authorization: `Bearer ${token}`}
            });
            toast.success(response.data.message || "Property Added Sucessfully!");
            setIsLoading(false);
            setTimeout( () => navigate("/properties"),3000);
        }
        catch(error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
            setIsLoading(false);
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
    return (
        <>
            <PanelLayout>
            <ToastContainer/>
            <div className="">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
                    {type?.charAt(0).toUpperCase() + (type?.slice(1) || "")} New Property
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                    >
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

                    <button
                    type="submit"
                    className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70" disabled = {isLoading}
                    >
                        {isLoading ? <ClipLoader color="white" size={19}/> : isEdit ? "Update Property" : "Add Property"}
                    </button>
                </form>
            </div>
            </PanelLayout>
            
        </>
    )
}

export default AddProperty;