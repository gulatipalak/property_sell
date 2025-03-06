const propertyModel = require("../../model/user/propertyModel");

exports.addProperty = async (req,res) => {
    try {
        const {property_name, postingFor, price, type, location , area, bedrooms, bathrooms, contact, amenities, furnished} = req.body;
        const user = req.user
        // console.log(user,"user")

        if(!property_name || !postingFor || !area || !price || !contact) {
            return res.status(400).json({status: false, code: 400, message: "Please Fill All Required Fields"});
        }
        // console.log("userId",user.id)

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
            furnished
        });

        // console.log(newProperty,"new")

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

        const properties = await propertyModel.find({
            userId : user.id
        }).select("-userId")
        .populate({ 
            path:"userId",
            //model:"user",
           select:"username"
        }).sort("-createdAt")

        console.log(properties,"properties")

        return res.status(200).json({status:true,code:200,data:properties})

    } catch (error) {
        return res.status(500).json({status: false, code: 500, message: "Internal Server Error:",error});
    }
}