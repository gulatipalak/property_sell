import { X } from "lucide-react";
import Button from "./Button";
import { useState } from "react";

interface PropertyFiltersProps {
    setIsFilterOffCanvas: React.Dispatch<React.SetStateAction<boolean>>;
    handleFilter: (filters: FormData) => void;
}


// ✅ Interface for Form Data State
interface FormData {
    location: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    postingFor: string;
    furnished: string[];
    rangeValue: number;
  }

const PropertyFilters = ( {setIsFilterOffCanvas, handleFilter}: PropertyFiltersProps ) => {
    const [formData, setFormData] = useState<FormData>({
        location: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        postingFor: '',
        furnished: [],
        rangeValue: 50000
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        const {name,value,type} = e.target;

        if (name === "furnished" && type == "checkbox") {
            const updatedFurnished = e.target.checked ?
                [...formData.furnished, value] :
                formData.furnished.filter((item) => item !== value);
            
                setFormData({
                    ...formData,
                    furnished: updatedFurnished
                })

        }else {
        setFormData({
            ...formData,
            [name]: value
        })}
    }
    const handleReset = () => {
        console.log("reset");
        setFormData({
            location: '',
            propertyType: '',
            bedrooms: '',
            bathrooms: '',
            area: '',
            postingFor: '',
            furnished: [],
            rangeValue: 50000
        })
    }

    const handleClose = () => {
        handleReset();
        setIsFilterOffCanvas(false);
    }
    console.log(formData);
    return (
        <div className="fixed inset-0 bg-[#0000007d] bg-opacity-50 flex justify-end z-50">
            <div className="w-100 bg-white pb-4 px-4 shadow-lg h-full overflow-y-auto">
                <div className="sticky bg-white top-0 flex justify-between mb-4 py-4">
                    <h2 className="text-lg font-bold">Filter Properties</h2>
                    <button className="cursor-pointer" onClick = {handleClose} ><X size={20} /></button>
                </div>
                
                {/* Location Dropdown */}
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700">Location</label>
                    <select id="location" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800" >
                        <option value="">All Locations</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                    </select>
                </div>

                {/* Property Type Dropdown */}
                <div className="mb-4">
                    <label htmlFor="propertyType" className="block text-gray-700">Property Type</label>
                    <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
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
                            <input type="radio" name="postingFor" value="rent" checked={formData.postingFor === "rent"} onChange={handleChange} /> Rent
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="postingFor" value="sale" checked={formData.postingFor === "sale"} onChange={handleChange} /> Sale
                        </label>
                    </div>
                </div>

                {/* Furnished Checkbox */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Furnishing</label>
                    <div className="flex flex-col gap-2">
                        <label><input type="checkbox" name="furnished" value="Fully Furnished" checked={formData.furnished.includes("Fully Furnished")} onChange={handleChange}/>Fully Furnished</label>
                        <label><input type="checkbox" name="furnished" value="Semi Furnished" checked={formData.furnished.includes("Semi Furnished")} onChange={handleChange}/>Semi Furnished</label>
                        <label><input type="checkbox" name="furnished" value="unfurnished" checked={formData.furnished.includes("Unfurnished")} onChange={handleChange}/>Unfurnished</label>
                </div>
                    
                </div>

                {/* Bedrooms Dropdown */}
                <div className="mb-4">
                    <label htmlFor="bedrooms" className="block text-gray-700">Bedrooms</label>
                    <select id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
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
                    <select id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
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
                    <input id="area" name="area" type="number" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800" placeholder="Enter area" />
                </div>

                {/* Price Range (Static UI) */}
                <div className="mb-4">
                    <label className="block text-gray-700">Price Range</label>
                    <input type="range" min="1000" max="100000" name="rangeValue" step="1000" value={formData.rangeValue} onChange={handleChange} className="w-full" />
                    <p className="text-gray-700">Range: ₹{formData.rangeValue}</p>
                </div>

                {/* Apply Filters Button */}
                <div className="flex gap-3">
                    <Button onClick={() => handleFilter(formData)}>Apply Filters</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;
