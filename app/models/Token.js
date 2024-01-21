import { mongoose } from "mongoose";

const Schema = mongoose.Schema;

const Token = new Schema({
    user_id: { type: Object, ref: 'User', unique: true },
    refresh_token: { type: String },
    otp: { type: String },
    time: { type: Date },
}, {
    timestamps: true,
})

module.exports = mongoose.model("Token", Token);