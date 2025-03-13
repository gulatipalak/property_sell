import { useState,useEffect, useContext } from "react";
import PanelLayout from "../../layouts/PanelLayout";
import { APP_URL } from "../../app_url";
import axios from "axios";
import { Link,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDialog } from "../../components/common/confirm"; 
import { ClipLoader } from "react-spinners";
import Button from "../../components/Button";
import { UserContext } from "../../context/UserContext";
interface Property {
    _id: string;
    property_name: string;
    postingFor: string;
    type: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    furnished: string;
    amenities: string[];
    contact: string;
    location: string;
    price: string;
    approvalStatus: string;
    image: string;
}

const PropertiesList = () => {
    const  navigate = useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [noProperties, setNoProperties] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect( () => {
        const fetchProperties = async() => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(`${APP_URL}/api/v1/user/landlord/get-properties`,{
                    headers:{Authorization: `Bearer ${token}`}
                })
                setIsLoading(false);
                setProperties(response.data.data.properties || []);
                console.log(response.data.data.properties);
            }
            catch (error:unknown) {
                if(axios.isAxiosError(error)){
                    if (error.response?.status === 404) {
                        console.log(error.response.data.message || "No properties Found");
                        setIsLoading(false);
                        setNoProperties(true);
                    }
                }
                else{
                    console.log(error || "Something went wrong. Please try again later.");
                }
            }
        }   
        fetchProperties();
    },[]); 

    const handleDelete = async (propertyId: string) => {
        const result = await confirmDialog("Are you sure you want to delete this property?");
        if (result) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.delete(`${APP_URL}/api/v1/user/landlord/delete-property/${propertyId}`,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                toast.success(response.data.message || "Property Deleted Successfully");
                setProperties((prev) => prev.filter((prop) => prop._id !== propertyId));
            }
            catch (error:unknown) {
                if(axios.isAxiosError(error)){
                    if (error.response?.status === 404) {
                        console.log(error.response.data.message || "Property not found!");
                        // setNoProperties(true);
                    }
                }
                else{
                    console.log(error || "Something went wrong. Please try again later.");
                }
            }
        }else {
                console.log("Deletion Canceled");
        }
    }

    const context = useContext(UserContext) ?? {user: null, setUser: () => {}};
    const {user} = context;
    return(
        <>
            <PanelLayout>
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
                    All Properties
                </h2>
                {isLoading ? <div className="flex justify-center items-center mt-60"><ClipLoader color="blue"/></div> : noProperties ? (
                        <div className="flex w-full h-full items-center justify-center">
                            <div className="text-center">
                                <h2 className="mb-4 font-medium text-gray-800 text-xl">No Property is added yet.</h2>
                                <Link to="/add-property" className="bg-blue-800 text-white hover:bg-blue-700 rounded-sm px-7 py-2 inline-block transition-all duration-300">Add Property</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {properties.map((property) => (
                            <div key={property._id} className="property-card border border-gray-300 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-4 group hover:border-blue-800 flex flex-col justify-between">
                                <div className="space-y-3 flex-1">
                                    {property.image && <img src={property.image} className="h-[200px] object-cover w-full" alt="property-image"/>}
                                    <h3 className="group-hover:text-blue-800 text-xl font-bold transition-all duration-300">{property.property_name}</h3>
                                    <p><strong>Posting For:</strong> {property.postingFor}</p>
                                    <p><strong>Type:</strong> {property.type}</p>
                                    <p><strong>Area:</strong> {property.area}</p>
                                    <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                                    <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                                    <p><strong>Furnished:</strong> {property.furnished}</p>
                                    <p><strong>Amenities:</strong> {property.amenities.join(", ")}</p>
                                    <p><strong>Location:</strong> {property.location}</p>
                                    <p><strong>Price:</strong> ₹{property.price}</p>
                                    <p><strong>Contact:</strong> {property.contact}</p>
                                    <p><strong>Status:</strong> {property.approvalStatus}</p>
                                </div>

                                {user?.role === "landlord" &&
                                    <div className="space-x-2 flex mt-4">
                                    <Button type="button" onClick={()=>navigate(`/property/edit/${property._id}`)}>Edit</Button>
                                    <Button type="button" onClick={() => handleDelete(property._id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
                                </div>
                                }
                                
                            </div>
                            ))}
                        </div>
                    )}
                    
            </PanelLayout>
        </>
    )
}

export default PropertiesList;