import { User } from "../../models/User";
import { bcrypt } from "bcrypt";
import { jwt } from "jsonwebtoken";
import { tokenController } from "./tokenController";

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

// Generate Access Token
const generateAccessToken = (user) => {
    const { id, user_name, role } = user;
    return jwt.sign({ uid: id, user_name, role }, process.env.JWT_ACCESS_KEY, { expiresIn: 60 * 10 });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    const { id, user_name, role } = user;
    return jwt.sign({ uid: id, user_name, role }, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });
};

// [POST] Login Account
const login = async (req, res) => {
    try {
        const { user_name, pass_word } = req.body;
        // Verify Username
        const user = await User.findOne({ user_name });
        if (!user) {
            return res.json("Wrong username");
        }
        // Verify Password
        const validPassword = await bcrypt.compare(pass_word, user.pass_word);
        if (!validPassword) {
            return res.json("Wrong password");
        }
        // Generate Token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        tokenController.createToken(user._id, refreshToken);
        return res.json({ accessToken, refreshToken, uid: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json("Internal Server Error");
    }
};

const refreshToken = async (req, res) => {
    try {
        const { uid, refreshToken } = req.body;
        if (!refreshToken) {
            return res.json("You're not authenticated");
        }
        const storedRefreshToken = tokenController.getToken(uid).refresh_token;
        if (storedRefreshToken !== refreshToken) {
            return res.json("Refresh Token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                tokenController.deleteToken(uid);
                return res.json(err);
            }
            // Generate new tokens
            const newAccessToken = generateAccessToken(user);
            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Error during token refresh:", error);
        res.status(500).json("Internal Server Error");
    }
};

const logout = async (req, res) => {
    try {
        const { uid } = req.body;
        // Delete the refresh token from the storage
        tokenController.deleteToken(uid);
        res.status(200).json("Logged out");
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json("Internal Server Error");
    }
};

module.exports = { register, login, refreshToken, logout }
