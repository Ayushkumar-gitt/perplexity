import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    content: {
        type: String,
        required: [true, "Please provide a message"]
    },
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: [true, "Please specify the role"]
    },
    fileUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const messageModel = mongoose.model("message",messageSchema)

export default messageModel
