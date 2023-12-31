import mongoose from "mongoose";


let isConnected=false;//tocheckmongooseconnections

export const connectToDB= async()=>{

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found')
    if(isConnected)return console.group('Alreadyu connected to DB');

    try { 
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected=true;
        console.log('connected to mongoDB')
    } catch (error) {
        console.log(error);
    }
}
 