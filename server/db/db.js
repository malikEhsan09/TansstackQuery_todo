import mongoose from "mongoose"


// function to connect teh db

const connectDB = async()=>{
   try{
 const connect = await mongoose.connect();
 if(connect){
    console.log("DB connectted successfully",process.env.MONGO_URL)
 }
 return connect
   }
   catch(error){
console.log("DB connecttion error")
   }
}