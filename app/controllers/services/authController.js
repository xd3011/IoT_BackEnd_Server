import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenController from "./tokenController";
import otpController from "./otpController";
import { mailSendResetPassword, mailSendConfirmAccount } from "../../../utils/mail";
import { generateAccessToken, generateRefreshToken } from "../../../utils/token";

// [POST] Register Account
const register = async (req, res) => {
    try {
        const { email, phone, user_name, pass_word, name } = req.body;

        // Validate that either email or phone is provided
        if (!email && !phone) {
            return res.status(400).send("Email or phone is required for registration.");
        }

        // Create password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass_word, salt);

        // Create and save User
        const newUser = new User({
            email,
            phone,
            user_name,
            pass_word: hashedPassword,
            verify: false,
            role: "user",
            name,
        });
        await newUser.save();
        // Send confirmation email if email is provided
        if (email) {
            mailSendConfirmAccount(email, newUser._id);
        }
        else {
            // Send SMS Link
        }
        res.status(200).send({ message: "Please go to your email and confirm your account" });
    } catch (error) {
        // Handle duplicate user_name error
        if (error.code === 11000 && error.keyPattern.user_name) {
            return res.status(409).send("Username already exists.");
        }
        console.error("Error in registration:", error);
        res.status(500).send("Internal Server Error");
    }
};

const confirmAccount = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const { uid } = req.params;
        // Find and update the user's verification status in the database
        const updatedUser = await User.findByIdAndUpdate(
            uid,
            { verify: true },
        );
        // Check if the user exists
        if (!updatedUser) {
            return res.status(404).json("Account not found");
        }
        // Return success message after confirming the account
        return res.status(200).json("Account Confirm Success");
    } catch (error) {
        // Handle any errors that may occur during the confirmation process
        console.error("Error during account confirmation:", error);
        return res.status(500).json("Internal Server Error");
    }
};

// [POST] Login Account
const login = async (req, res) => {
    try {
        const { user_name, pass_word } = req.body;
        // Find user by username
        const user = await User.findOne({ user_name });
        // Check the existence of the user
        if (!user) {
            return res.status(401).json({ error: "Wrong username" });
        }
        // Check the password
        const validPassword = await bcrypt.compare(pass_word, user.pass_word);

        if (!validPassword) {
            return res.status(401).json({ error: "Wrong password" });
        }
        // Check the verification status of the account
        if (!user.verify) {
            return res.status(401).json({ error: "Account is not verified" });
        }
        const isAdmin = user.role === "admin" ? 1 : 0;
        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Create and save the refresh token for future refreshment
        const indexToken = await tokenController.createToken(user._id, refreshToken);
        // Return token information and user id
        return res.status(200).json({ indexToken, accessToken, refreshToken, uid: user._id, message: 'Login Successfully', isAdmin });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const setTokenNotification = async (req, res) => {
    try {
        const { uid } = req.user;
        const { tokenNotification } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.tokenNotification.includes(tokenNotification)) {
            user.tokenNotification.push(tokenNotification);
            await user.save();
        }
        return res.status(200).json({ message: "Set Token Notification Successfully" });
    } catch (error) {
        console.error("Error during set token notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const removeTokenNotification = async (req, res) => {
    try {
        const { tokenNotification, uid } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const index = user.tokenNotification.indexOf(tokenNotification);
        if (index > -1) {
            user.tokenNotification.splice(index, 1);
            await user.save();
            return res.status(200).json({ message: "Remove Token Notification Successfully" });
        } else {
            return res.status(404).json({ error: "Token Notification not found" });
        }
    } catch (error) {
        console.error("Error during remove token notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

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
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// [POST] Logout Account
const logout = async (req, res) => {
    try {
        const { uid } = req.params;
        const { indexToken } = req.body;
        console.log(uid, indexToken);
        // Delete the refresh token from the storage
        tokenController.deleteToken(uid, indexToken);
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const editPassword = async (req, res) => {
    try {
        const { uid, oldPassword, newPassword } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Validate old password
        const validPassword = await bcrypt.compare(oldPassword, user.pass_word);
        if (!validPassword) {
            return res.status(401).json({ error: "Wrong password" });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.pass_word = hashedPassword;
        await user.save();
        return res.status(200).json({ message: "Update Password Successfully" });
    } catch (error) {
        // Handle errors and provide more details
        console.error("Error during password update:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
        const OTP = await otpController.createOtp(user._id);
        mailSendResetPassword(user.email, OTP);
        return res.status(200).json({ message: "Please check your email to retrieve your password", uid: user._id });
    } catch (error) {
        // Handle errors and provide more details
        console.error("Error during password reset:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const confirmForgotPassword = async (req, res) => {
    try {
        const { otp, uid } = req.body;
        const isOtpValid = await otpController.checkOtp(uid, otp);
        if (!isOtpValid) {
            return res.status(401).json({ error: "Invalid OTP" });
        }
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({ error: " Cannot find user" });
        }
        const newAccessToken = generateAccessToken(user);
        // Add your logic for successful OTP verification here
        return res.status(200).json({ message: "OTP verification successful", accessToken: newAccessToken });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { uid } = req.user;
        const { newPassword } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.pass_word = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Reset Password Successful' });
    } catch (error) {
        console.error("", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { register, login, refreshToken, logout, editPassword, forgotPassword, confirmForgotPassword, confirmAccount, resetPassword, setTokenNotification, removeTokenNotification };
