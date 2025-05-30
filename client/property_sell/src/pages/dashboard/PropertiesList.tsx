import { useState,useEffect } from "react";
import PanelLayout from "../../layouts/PanelLayout";
import { APP_URL } from "../../global_variables";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDialog } from "../../components/common/confirm"; 
import { ClipLoader } from "react-spinners";
import Button from "../../components/Button";
import { useUser } from "../../context/UserContext";
import PropertyFilters from "../../components/PropertyFilters";
import { FiltersType } from "../../types";

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
    price: number;
    approvalStatus: string;
    image: string;
    userId: string;
}

const PropertiesList = () => {
    const  navigate = useNavigate();
    const {user} = useUser();
    const [properties, setProperties] = useState<Property[]>([]);
    const [noProperties, setNoProperties] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOffcanvas, setIsFilterOffCanvas] = useState(false);
    const [filterData, setFilterData] = useState<FiltersType>({
        location: '',
        type: '',
        bedrooms: '',
        bathrooms: '',
        area: "" as number | "",
        postingFor: '',
        furnished: []
        // price: 50000
    });
    const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
        location: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        postingFor: "",
        furnished: [],
      });
    // const getAppliedFilters = localStorage.getItem("property_filters");
    // let FiltersObject = "";
    // let FiltersArray: string[] = [];
    // let restoreFilters;
    
    const fetchProperties = async(filterData?: FiltersType) => {
        if (filterData) {
            setAppliedFilters(filterData);
          }
        // console.log("filter Properties",filterData);
        const queryParams = new URLSearchParams();

        // ✅ Convert FiltersData to a valid object
        if (filterData) {
            for (const [key, value] of Object.entries(filterData)) {
                queryParams.append(key, value.toString());
            }
        }
        // console.log(queryParams.toString(),"queryParams");
        // localStorage.setItem("property_filters",JSON.stringify(filterData)) 

        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                toast.error("Authentication error! Please log in.");
                navigate("/login");
                return;
            }

            const response = await axios.get(`${APP_URL}/api/v1/user/landlord/get-properties?${queryParams}`,{
                headers:{Authorization: `Bearer ${token}`}
            })
            const fetchedProperties = response.data.data.properties || [];
            setIsLoading(false);
            setProperties(fetchedProperties);
            setNoProperties(false);
            // console.log(response.data.data.properties);
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

    useEffect( () => {  
        fetchProperties();
        // Ensure it's not undefined or the literal string "undefined"
        // if (getAppliedFilters && getAppliedFilters !== "undefined") {
        //     restoreFilters = JSON.parse(getAppliedFilters);
        // } else {
        //     restoreFilters = filterData; // fallback
        // }
        // setFilterData(restoreFilters);
        // return (()=> {
        //     localStorage.removeItem("property_filters");
        // })
    },[]); 

    const handleDelete = async (propertyId: string) => {
        const result = await confirmDialog("Are you sure you want to delete this property?");
        if (result) {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    toast.error("Authentication error! Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.delete(`${APP_URL}/api/v1/user/landlord/delete-property/${propertyId}`,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                toast.success(response.data.message || "Property Deleted Successfully");
                setProperties((prev) => {
                    const updatedProperties = prev.filter((prop) => prop._id !== propertyId);
                    setNoProperties(updatedProperties.length === 0); // If no properties left, update state
                    return updatedProperties;
                });
                
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
    
    // console.log("getAppliedFilters:",getAppliedFilters);
   
        // if (getAppliedFilters && getAppliedFilters !== "undefined" && getAppliedFilters !== "null") {
        //     FiltersObject = JSON.parse(getAppliedFilters);
        //     console.log("FiltersObject:", FiltersObject);
        
        //     FiltersArray= Object.entries(FiltersObject).flatMap(([key, value]) => {
        //         if (Array.isArray(value) && value.length > 0) {
        //         return value.map(v => `${capitalize(key)}: ${v}`);
        //         } else if (value !== "") {
        //         return `${capitalize(key)}: ${value}`;
        //         } else {
        //         return [];
        //         }
        //     });
        //   console.log("filters:", FiltersArray);
        // }

    // function capitalize(str:string) {
    //     return str.charAt(0).toUpperCase() + str.slice(1);
    // }

    // const removeFilter = (key:keyof FiltersType,valueToRemove:string|number) => {
    //     console.log("remove filter",key,valueToRemove);
    //     setFilterData((prev: FiltersType) => {
    //         const updated:FiltersType = {...prev};

    //         if(Array.isArray(updated[key])) {
    //             updated[key] = updated[key].filter((v)=> v!==valueToRemove)
    //         }
    //     })
    // }
    return(
        <>
            <PanelLayout>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-blue-800 text-center">
                        All Properties
                    </h2>
                    {user?.role === "landlord" ? 
                    (<Button to="/properties/property/add">Add Property</Button>):(<Button className="w-auto!" onClick={()=>setIsFilterOffCanvas(true)}>Filters</Button>) }
                </div>

                {/* {FiltersArray.length > 0 && <div className="flex gap-2 items-center mb-4 flex-wrap">
                    {FiltersArray.map((filter,idx) => {
                    return (
                        <div key={idx} className="flex gap-2 items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm">
                            <span>{filter}</span>
                            <button className="text-blue-500 hover:text-blue-700 font-bold" onClick={()=>{removeFilter()}}>
                                &times;
                            </button>
                        </div>
                    )
                })}
                </div>} */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                {Object.entries(appliedFilters).filter(([ ,val]) => Array.isArray(val) ? val.length > 0 : val !=="" ).map(([key, val]) =>
                Array.isArray(val) ? (
                    val.map((v) => (
                    <div key={key + v} className="flex gap-2 items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm">
                        {key.charAt(0).toUpperCase()+ key.slice(1)}: {v}
                        <button > &times;</button>
                    </div>
                    ))
                ) : (
                    <div key={key} className="flex gap-2 items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm">
                    {key.charAt(0).toUpperCase()+ key.slice(1)}: {val} <button className="cursor-pointer" > &times;</button>
                    </div>
                )
                )}
                </div>
                
                {isLoading ? <div className="flex justify-center items-center mt-60"><ClipLoader color="blue"/></div> : noProperties ? (
                        <div className="flex w-full h-full items-center justify-center">
                            <div className="text-center">
                                <h2 className="mb-4 font-medium text-gray-800 text-xl">No Property is added yet.</h2>
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
                                    <Button type="button" onClick={()=>navigate(`/properties/property/edit/${property._id}`)}>Edit</Button>
                                    <Button type="button" onClick={() => handleDelete(property._id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
                                   </div>
                                }
                                {user?.role === "tenant" &&
                                    <Button to={`/chat/${property.userId}`} type="button" className="mt-4 text-center">Chat with Landlord</Button>
                                }
                            </div>
                            ))}
                        </div>
                    )}

                {isFilterOffcanvas && <PropertyFilters filters={filterData} setFilters={setFilterData} setIsFilterOffCanvas= {setIsFilterOffCanvas} applyFilters={fetchProperties}/>}
            </PanelLayout>
        </>
    )
}

export default PropertiesList;