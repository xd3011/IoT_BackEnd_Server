import { User } from "../../models/User";
import { bcrypt } from "bcrypt";
import { jwt } from "jsonwebtoken";
import { tokenController } from "./tokenController";
import { mailSendResetPassword } from "../../../utils/mail";

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

// [POST] Refresh Token
const refreshToken = async (req, res) => {
    try {
        const { uid } = req.params;
        const { refreshToken } = req.body;
        // Check if refreshToken is provided
        if (!refreshToken) {
            return res.status(401).json("You're not authenticated");
        }
        const storedRefreshToken = tokenController.getToken(uid)?.refresh_token;
        // Check if stored refresh token is valid
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            return res.status(401).json("Refresh Token is not valid");
        }
        const decodedUser = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        // Generate new access token
        const newAccessToken = generateAccessToken(decodedUser);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        // Handle internal server error and provide more details
        console.error("Error during token refresh:", error);
        res.status(500).json("Internal Server Error");
    }
};


// [POST] Logout Account
const logout = async (req, res) => {
    try {
        const { uid } = req.params;
        // Delete the refresh token from the storage
        tokenController.deleteToken(uid);
        res.status(200).json("Logged out");
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json("Internal Server Error");
    }
};

const editPassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json("Invalid ID");
        }
        // Validate old password
        const validPassword = await bcrypt.compare(oldPassword, user.pass_word);
        if (!validPassword) {
            return res.status(401).json("Wrong password");
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.pass_word = hashedPassword;
        await user.save();
        return res.status(200).json("Update Password Successfully");
    } catch (error) {
        // Handle errors and provide more details
        console.error("Error during password update:", error);
        res.status(500).json("Internal Server Error");
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { user_name, email, phone } = req.body;
        // Find user by user_name
        const user = await User.findOne({ user_name });
        // Check if user exists
        if (!user) {
            return res.status(404).json("Invalid username");
        }
        // Check if email or phone matches the user's data
        if (email && user.email !== email) {
            return res.status(401).json("Invalid email");
        }
        if (phone && user.phone !== phone) {
            return res.status(401).json("Invalid phone");
        }
        // Create OTP
        const OTP = tokenController.createOtp(user._id);
        mailSendResetPassword(user.email, OTP);
        return res.status(200).json("Please check your email to retrieve your password");
    } catch (error) {
        // Handle errors and provide more details
        console.error("Error during password reset:", error);
        res.status(500).json("Internal Server Error");
    }
};

const confirmForgotPassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { OTP } = req.body;
        const isOtpValid = await tokenController.checkOtp(uid, OTP);
        if (!isOtpValid) {
            return res.status(401).json("Invalid OTP");
        }
        // Add your logic for successful OTP verification here
        return res.status(200).json("OTP verification successfully");
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json("Internal Server Error");
    }
};



module.exports = { register, login, refreshToken, logout, editPassword, forgotPassword, confirmForgotPassword }
