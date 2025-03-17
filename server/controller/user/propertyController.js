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
            properties = await propertyModel.find();
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
        console.log(property_id);

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