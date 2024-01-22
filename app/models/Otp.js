import { mongoose } from "mongoose";

const { Schema, Types } = mongoose;

const Otp = new Schema({
    user_id: { type: Types.ObjectId, ref: 'User', unique: true },
    otp: { type: String },
    time: { type: Date },
}, {
    timestamps: true,
})

module.exports = mongoose.model("Otp", Otp);