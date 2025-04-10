import { X } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_URL } from "../global_variables";
import { useUser } from "../context/UserContext";
import { FiltersType } from "../types";

interface PropertyFiltersProps {
    setIsFilterOffCanvas: React.Dispatch<React.SetStateAction<boolean>>;
    applyFilters: (filters: FiltersType) => void;
    filters: FiltersType,
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>
}


const PropertyFilters = ( {setIsFilterOffCanvas, applyFilters,filters, setFilters}: PropertyFiltersProps ) => {
    const {token} = useUser();
    
    const [locations,setLocations] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        const {name,value,type} = e.target;

        if (name === "furnished" && type == "checkbox") {
            const updatedFurnished = e.target.checked ?
                [...filters.furnished, value] :
                filters.furnished.filter((item) => item !== value);
            
                setFilters({
                    ...filters,
                    furnished: updatedFurnished
                })

        }else {
            setFilters({
            ...filters,
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
    
        setFilters(resetFilters);         // Update state
        applyFilters(resetFilters);          // Call filter function with updated values
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
    },[])

    // console.log(filters);
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
                    <select id="location" name="location" value={filters.location} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800" >
                        <option value="">All Locations</option>
                        {locations.map((location,index) => 
                            (<option key={index} value={location}>{location}</option>)
                        )}
                    </select>
                </div>

                {/* Property Type Dropdown */}
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700">Property Type</label>
                    <select id="type" name="type" value={filters.type} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
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
                            <input type="radio" name="postingFor" value="rent" checked={filters.postingFor === "rent"} onChange={handleChange} /> Rent
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="postingFor" value="sell" checked={filters.postingFor === "sell"} onChange={handleChange} /> Sell
                        </label>
                    </div>
                </div>

                {/* Furnished Checkbox */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Furnishing</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex gap-2"><input type="checkbox" name="furnished" value="Fully Furnished" checked={filters.furnished.includes("Fully Furnished")} onChange={handleChange}/>Fully Furnished</label>
                        <label className="flex gap-2"><input type="checkbox" name="furnished" value="Semi Furnished" checked={filters.furnished.includes("Semi Furnished")} onChange={handleChange}/>Semi Furnished</label>
                        <label className="flex gap-2"><input type="checkbox" name="furnished" value="Unfurnished" checked={filters.furnished.includes("Unfurnished")} onChange={handleChange}/>Unfurnished</label>
                    </div>
                </div>

                {/* Bedrooms Dropdown */}
                <div className="mb-4">
                    <label htmlFor="bedrooms" className="block text-gray-700">Bedrooms</label>
                    <select id="bedrooms" name="bedrooms" value={filters.bedrooms} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
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
                    <select id="bathrooms" name="bathrooms" value={filters.bathrooms} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
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
                    <input id="area" name="area" type="number" value={filters.area} onChange={handleChange} onWheel={(e) => e.currentTarget.blur()} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="Enter area" />
                </div>

                {/* Price Range (Static UI) */}
                {/* <div className="mb-4">
                    <label className="block text-gray-700">Price Range</label>
                    <input type="range" min="1000" max="100000" name="price" step="1000" value={filters.price} onChange={handleChange} className="w-full" />
                    <p className="text-gray-700">Range: ₹{filters.price}</p>
                </div> */}

                {/* Apply Filters Button */}
                <div className="flex gap-3">
                    <Button onClick={() => {applyFilters(filters); handleClose()}}>Apply Filters</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;
