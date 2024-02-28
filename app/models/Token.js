import { mongoose } from "mongoose";

const { Schema, Types } = mongoose;

const Token = new Schema({
    // user_id: { type: Types.ObjectId, ref: 'User', unique: true },
    user_id: { type: String },
    refresh_tokens: [{ type: String }]
}, {
    timestamps: true,
})

module.exports = mongoose.model("Token", Token);