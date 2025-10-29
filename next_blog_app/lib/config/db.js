import mongoose from "mongoose";

export const ConnectDB = async () =>{
await mongoose.connect('mongodb+srv://nagalingamviveharan2001_db_user:vive12345678@cluster0.qmbls9h.mongodb.net/?appName=Cluster0')
console.log("DB connected");

}