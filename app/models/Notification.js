import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const Notification = new Schema(
    {
        uid: { type: Types.ObjectId, ref: 'User' },
        title: { type: String },
        content: { type: String },
        state: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Notification", Notification);
