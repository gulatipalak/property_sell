const propertyModel = require("../../model/user/propertyModel");

exports.addProperty = async (req,res) => {
    try {
        const {property_name,postingFor,price,type,location} = req.body;
        const user = req.user
        console.log(user,"user")

        if(!property_name || !postingFor || !price) {
            return res.status(400).json({status: false, code: 400, message: "Please fill all required fields"});
        }
        console.log("userId",user.id)

        const newProperty = new propertyModel({
            userId:user.id,
            property_name,
            postingFor,
            type,
            location,
            price,
        });

        console.log(newProperty,"new")

        await newProperty.save();
        return res.status(200).json({status: true, code: 200, message: "Property added successfully!"});
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