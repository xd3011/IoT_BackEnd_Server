import mongoose from "mongoose";

const { Schema } = mongoose;

const DeviceType = new Schema(
    {
        type: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('DeviceType', DeviceType);