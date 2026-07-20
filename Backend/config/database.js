import mongoose from "mongoose";

function connectToDb() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("connected to DB");
    })
}

export default connectToDb