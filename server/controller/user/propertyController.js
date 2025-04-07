const propertyModel = require("../../model/user/propertyModel");

exports.addProperty = async (req,res) => {
    try {
        const {property_name, postingFor, price, type, location , area, bedrooms, bathrooms, contact, amenities, furnished} = req.body;
        const user = req.user

        if(!property_name || !postingFor || !area || !price || !contact) {
            return res.status(400).json({status: false, code: 400, message: "Please Fill All Required Fields"});
        }


        let imageUrl = req.file ? req.file.path : null;
        // console.log(imageUrl);

        const newProperty = new propertyModel({
            userId:user.id,
            property_name,
            postingFor,
            type,
            location,
            price,
            area, 
            bedrooms, 
            bathrooms, 
            contact, 
            amenities, 
            furnished,
            image: imageUrl,
        });

        await newProperty.save();
        return res.status(200).json({status: true, code: 200, message: "Property Added Successfully!"});
    }
    catch (error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error:",error});
    }
}


exports.getMyProperties = async (req,res) =>{
    try {
        const user = req.user;
        const searchQuery = req.query;
        // console.log("searchQuery",searchQuery);

        let filter = {};

        if (req.query.location){
            filter.location = req.query.location;
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }
        if (req.query.bedrooms) {
            if(Number(req.query.bedrooms) > 4){
                filter.bedrooms = {$gte: Number(req.query.bedrooms)}
                
            }
            else {filter.bedrooms = Number(req.query.bedrooms)}
        }
        if (req.query.bathrooms) {
            if(Number(req.query.bathrooms) > 4){
                filter.bathrooms = {$gte: Number(req.query.bathrooms)};
            }
            else {
                filter.bathrooms = Number(req.query.bathrooms);
            }
        }
        if (req.query.area) {
            filter.area = Number(req.query.area);
        }
        if (req.query.postingFor) {
            filter.postingFor = {$regex: req.query.postingFor,$options: "i"};
        }
        if(req.query.furnished) {
            filter.furnished = {$in: req.query.furnished.split(",")};
        }
        if(req.query.price && !isNaN(req.query.price)) {
            filter.price = { $lte: Number(req.query.price)};
        }
        // console.log("filters:",filter);


        let properties = [];
        if(user.role === "landlord") {
            properties = await propertyModel.find({
                userId : user.id
            }).select("-userId")
            .populate({ 
                path:"userId",
                //model:"user",
            select:"username"
            }).sort("-createdAt")

        } else if (user.role === "tenant") {
            properties = await propertyModel.find(filter);
        }
      

        if(properties.length === 0) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "No Properties added yet."
            });
        }

        // console.log(properties,"properties")

        return res.status(200).json({status:true,code:200,data:{properties: properties}})

    } catch (error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error:",error});
    }
}

exports.deleteProperty = async (req,res) => {
    try {
        const property_id = req.params.id;
        // console.log(property_id);

        if (!property_id) {
            return res.status(400).json({ status: false, code: 400, message: "Property ID is required!" });
        }

        const property = await propertyModel.findByIdAndDelete(property_id);

        if (!property) {
            return res.status(404).json({ status: false, code: 404, message: "Property not found!" });
        }

        return res.status(200).json({status: true, code: 200, message: "Property Deleted Successfully!"});
    } catch (error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error", error});
    }
}

exports.getProperty = async (req,res) => {
    try {
        const property_id = req.params.id;
        
        if (!property_id) {
            return res.status(400).json({ status: false, code: 400, message: "Property ID is required!" });
        }
        
        const property = await propertyModel.findById(property_id).select("-approvalStatus");

        if(!property) {
            return res.status(404).json({ status: false, code: 404, message: "Property not found" });
        }

        return res.status(200).json({status: true, code: 200, data:{property: property}});
    }
    catch(error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error", error});
    }
}

exports.updateProperty = async (req,res) => {
    try {
        const property_id = req.body.property_id;
        const {...formData} = req.body;

        if (!property_id) {
            return res.status(400).json({ status: false, code: 400, message: "Property ID is required!" });
        }

        let imageUrl = req.file ? req.file.path : null;
        
        const property = await propertyModel.findByIdAndUpdate(property_id, {formData,image:imageUrl},{new: true});
        return res.status(200).json({status: true, code: 200, message:"Property Updated Successfully!", data:{property: property}});

    } catch(error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error", error});
    }
}

exports.getLocations = async (req,res) => {
    try {
        // console.log("locations api working");
        const Locations = (await propertyModel.distinct("location")).sort();
        // console.log("locations",Locations);
        return res.status(200).json({status: true, code: 200, message:"All locations", data:Locations});

    } catch(error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error", error});
    }
}