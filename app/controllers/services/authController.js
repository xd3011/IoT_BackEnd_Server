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
        mailSendConfirmAccount(newUser._id);
        res.status(200).send("Confirm Account");
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
        // Find user by username
        const user = await User.findOne({ user_name });
        // Check the existence of the user
        if (!user) {
            return res.status(401).json("Wrong username");
        }
        // Check the password
        const validPassword = await bcrypt.compare(pass_word, user.pass_word);
        if (!validPassword) {
            return res.status(401).json("Wrong password");
        }
        // Check the verification status of the account
        if (!user.verify) {
            return res.status(401).json("Account is not verified");
        }
        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Create and save the refresh token for future refreshment
        tokenController.createToken(user._id, refreshToken);
        // Return token information and user id
        return res.status(200).json({ accessToken, refreshToken, uid: user._id });
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



module.exports = { register, login, refreshToken, logout, editPassword, forgotPassword, confirmForgotPassword, confirmAccount }
