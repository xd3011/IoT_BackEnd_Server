import { mongoose } from "mongoose";

const { Schema, Types } = mongoose;

const Token = new Schema({
    user_id: { type: Types.ObjectId, ref: 'User', unique: true },
    refresh_token: { type: String },
    otp: { type: String },
    time: { type: Date },
}, {
    timestamps: true,
})

module.exports = mongoose.model("Token", Token);