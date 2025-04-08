import { X } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_URL } from "../global_variables";
import { useUser } from "../context/UserContext";

interface PropertyFiltersProps {
    setIsFilterOffCanvas: React.Dispatch<React.SetStateAction<boolean>>;
    handleFilter: (filters: FiltersData) => void;
}


// ✅ Interface for Form Data State
interface FiltersData {
    location: string;
    type: string;
    bedrooms: string;
    bathrooms: string;
    area: number | "";
    postingFor: string;
    furnished: string[];
    // price: number | "";
  }

const PropertyFilters = ( {setIsFilterOffCanvas, handleFilter}: PropertyFiltersProps ) => {
    const {token} = useUser();
    const [filterData, setFilterData] = useState<FiltersData>({
        location: '',
        type: '',
        bedrooms: '',
        bathrooms: '',
        area: "" as number | "",
        postingFor: '',
        furnished: []
        // price: 50000
    });
    const [locations,setLocations] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        const {name,value,type} = e.target;

        if (name === "furnished" && type == "checkbox") {
            const updatedFurnished = e.target.checked ?
                [...filterData.furnished, value] :
                filterData.furnished.filter((item) => item !== value);
            
                setFilterData({
                    ...filterData,
                    furnished: updatedFurnished
                })

        }else {
        setFilterData({
            ...filterData,
            [name]: value
        })}
    }
    const handleReset = () => {
        const resetFilters = {
            location: '',
            type: '',
            bedrooms: '',
            bathrooms: '',
            area: "" as number | "",
            postingFor: '',
            furnished: [],
            price: "" as number | ""
        };
    
        setFilterData(resetFilters);         // Update state
        handleFilter(resetFilters);          // Call filter function with updated values
    }

    const handleClose = () => {
        setIsFilterOffCanvas(false);
    }

    useEffect(() => {
        const fetchLocations = async() => {
            try{
                const response = await axios.get(`${APP_URL}/api/v1/user/landlord/get-locations`,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                // console.log(response.data.data);
                setLocations(response.data.data);
            }catch(error) {
                console.log(error);
            }
        }
        fetchLocations();
        const getStoredFilters = localStorage.getItem("property_filters");
        let restoreFilters;

          // Ensure it's not undefined or the literal string "undefined"
          if (getStoredFilters && getStoredFilters !== "undefined") {
            restoreFilters = JSON.parse(getStoredFilters);
          } else {
            restoreFilters = filterData; // fallback
          }
        
        setFilterData(restoreFilters);
    },[])

    // console.log(filterData);
    return (
        <div className="fixed inset-0 bg-[#0000007d] bg-opacity-50 flex justify-end z-50" onClick = {handleClose}>
            <div className="w-100 bg-white pb-4 px-4 shadow-lg h-full overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
                <div className="sticky bg-white top-0 flex justify-between mb-4 py-4">
                    <h2 className="text-lg font-bold">Filter Properties</h2>
                    <button className="cursor-pointer" onClick = {handleClose} ><X size={20} /></button>
                </div>
                
                {/* Location Dropdown */}
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700">Location</label>
                    <select id="location" name="location" value={filterData.location} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800" >
                        <option value="">All Locations</option>
                        {locations.map((location,index) => 
                            (<option key={index} value={location}>{location}</option>)
                        )}
                    </select>
                </div>

                {/* Property Type Dropdown */}
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700">Property Type</label>
                    <select id="type" name="type" value={filterData.type} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
                        <option value="">All Types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Shop">Shop</option>
                        <option value="Office">Office</option>
                    </select>
                </div>

                {/* Posting For - Radio Buttons */}
                <div className="mb-4">
                    <label htmlFor="postingFor" className="block text-gray-700">Posting For</label>
                    <div className="flex gap-3">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="postingFor" value="rent" checked={filterData.postingFor === "rent"} onChange={handleChange} /> Rent
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="postingFor" value="sell" checked={filterData.postingFor === "sell"} onChange={handleChange} /> Sell
                        </label>
                    </div>
                </div>

                {/* Furnished Checkbox */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Furnishing</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex gap-2"><input type="checkbox" name="furnished" value="Fully Furnished" checked={filterData.furnished.includes("Fully Furnished")} onChange={handleChange}/>Fully Furnished</label>
                        <label className="flex gap-2"><input type="checkbox" name="furnished" value="Semi Furnished" checked={filterData.furnished.includes("Semi Furnished")} onChange={handleChange}/>Semi Furnished</label>
                        <label className="flex gap-2"><input type="checkbox" name="furnished" value="Unfurnished" checked={filterData.furnished.includes("Unfurnished")} onChange={handleChange}/>Unfurnished</label>
                    </div>
                </div>

                {/* Bedrooms Dropdown */}
                <div className="mb-4">
                    <label htmlFor="bedrooms" className="block text-gray-700">Bedrooms</label>
                    <select id="bedrooms" name="bedrooms" value={filterData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>

                {/* Bathrooms Dropdown */}
                <div className="mb-4">
                    <label htmlFor="bathrooms" className="block text-gray-700">Bathrooms</label>
                    <select id="bathrooms" name="bathrooms" value={filterData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>

                {/* Area Input */}
                <div className="mb-4">
                    <label htmlFor="area" className="block text-gray-700">Area (sq ft)</label>
                    <input id="area" name="area" type="number" value={filterData.area} onChange={handleChange} onWheel={(e) => e.currentTarget.blur()} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="Enter area" />
                </div>

                {/* Price Range (Static UI) */}
                {/* <div className="mb-4">
                    <label className="block text-gray-700">Price Range</label>
                    <input type="range" min="1000" max="100000" name="price" step="1000" value={filterData.price} onChange={handleChange} className="w-full" />
                    <p className="text-gray-700">Range: ₹{filterData.price}</p>
                </div> */}

                {/* Apply Filters Button */}
                <div className="flex gap-3">
                    <Button onClick={() => {handleFilter(filterData); handleClose()}}>Apply Filters</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;
