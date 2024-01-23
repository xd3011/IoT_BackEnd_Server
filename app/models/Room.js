import mongoose from "mongoose"

const { Schema, Types } = mongoose;

const Room = new Schema({
    room_name: { type: String },
    home_id: { type: Types.ObjectId, ref: 'Home' },
}, {
    timestamps: true,
})

export default mongoose.model("Room", Room);