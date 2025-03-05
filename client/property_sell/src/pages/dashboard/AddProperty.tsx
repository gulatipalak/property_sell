import PanelLayout from "../../layouts/PanelLayout";

const AddProperty = () => {
    return (
        <>
            <PanelLayout>
            <div className="">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
                    Add New Property
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Property Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter property name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Posting Property For</label>
                        <select
                            name="postingFor"
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        >
                            <option value="sell">Sell</option>
                            <option value="rent">Rent</option>
                        </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Property Type</label>
                    <select
                        name="type"
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                    >
                        <option value="">Select Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="shop">Shop</option>
                        <option value="office">Office</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium">Location</label>
                    <input
                        type="text"
                        name="location"
                        className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                        placeholder="Enter location"
                    />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            className="w-full mt-1 p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter price"
                        />
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Add Property
                    </button>
                </form>
            </div>
            </PanelLayout>
            
        </>
    )
}

export default AddProperty;