import { User } from "../../models/User";
import { bcrypt } from "bcrypt";

// [POST] Register Account
const register = async (req, res) => {
    try {
        const { email, phone, user_name, password, name } = req.body;
        // Validate that either email or phone is provided
        if (!email && !phone) {
            return res.status(400).send("Email or phone is required for registration.");
        }
        // Determine the login field based on provided data
        const loginField = email ? { email } : { phone };
        // Create password hash
        const salt = await bcrypt.getSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create and save User
        const newUser = new User({
            ...loginField,
            user_name,
            pass_word: hashedPassword,
            verify: false,
            role: "user",
            name,
            home_list: [],
        });
        await newUser.save();
        // Send Confirm Email or Phone
        res.status(200).send("Confirm Account");
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { register }
