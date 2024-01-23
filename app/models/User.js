import mongoose from "mongoose";

const { Schema, Types } = mongoose; // Destructure Types from mongoose

const User = new Schema(
    {
        email: { type: String },
        phone: { type: String },
        user_name: { type: String, required: true },
        pass_word: { type: String, required: true },
        verify: { type: Boolean },
        role: { type: String },
        name: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", User);
