import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema(
    {
        email: { type: String },
        phone: { type: String },
        user_name: { type: String, require: true },
        pass_word: { type: String, require: true },
        verify: { type: Boolean },
        role: { type: String },
        // home_list: [{ type: ObjectId, ref: 'Home' }],
        home_list: [{ type: ObjectId }],
        name: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", User);
