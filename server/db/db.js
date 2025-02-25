const mongoose = require("mongoose")

let mongodbUrl = process.env.MODE === "prod" ? process.env.prodUrl : process.env.devUrl
console.log(mongodbUrl)

//***************Mongoose connection*****************//

const connectToDatebase = async()=>{
    try {
        await mongoose.connect(mongodbUrl,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log("Database is connected")
    } catch (err) {
        console.error("Error while connecting to the database",err)
    }
}

connectToDatebase();

module.exports = mongoose;
