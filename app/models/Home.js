import mongoose from "mongoose"

const { Schema, Types } = mongoose;

const Home = new Schema({
    home_name: { type: String },
    address: { type: String },
    user_in_home: [{ type: Types.ObjectId, ref: 'User' }],
    home_owner: { type: Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
})

export default mongoose.model("Home", Home);