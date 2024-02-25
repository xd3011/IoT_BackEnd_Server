import mongoose from "mongoose";

const { Schema, Types } = mongoose; // Destructure Types from mongoose

const Device = new Schema(
    {
        device_owner: { type: Types.ObjectId, ref: 'User' },
        device_in_room: { type: Types.ObjectId, ref: 'Room' },
        device_name: { type: String },
        gateway_code: { type: String },
        mac_address: { type: String },
        verify: { type: Boolean },
        device_online: { type: Boolean },
        device_type: { type: Number },
        // device_code: { type: Number },
        device_data: { type: Object },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Device", Device);
