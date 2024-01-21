import Token from "../../models/Token";

const createToken = (uid, refreshToken) => {
    const newToken = new Token({
        user_id: uid,
        refresh_token: refreshToken,
    })
    newToken.save();
    console.log("Save Token Success");
}

const getToken = async (uid) => {
    return token = await Token.findOne({ user_id: uid });
}

const deleteToken = async (uid) => {
    try {
        const deletedToken = await Token.findOneAndDelete({ user_id: uid });
        if (deletedToken) {
            console.log("Delete Token Success");
        } else {
            console.log("Token not found");
        }
    } catch (error) {
        console.error("Error deleting token:", error);
    }
};


const createOtp = async (uid) => {
    // Generate a random OTP with 6 digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const currentTime = Date.now();
    // Add 5 minutes (300,000 milliseconds) to get the expiration time
    const expirationTime = currentTime + 300000;
    // Create a new Token object with the expiration time
    const token = await Token.findOne({ user_id: uid });
    if (!token) {
        const newOtp = new Token({
            user_id: uid,
            otp: otp,
            time: expirationTime
        })
        newOtp.save();
        return otp;
    }
    token.otp = otp;
    token.time = expirationTime;
    token.save();
    return otp;
};


const checkOtp = async (uid, userEnteredOtp) => {
    try {
        // Find the stored OTP for the given user
        const storedOtpObject = await Token.findOne({ user_id: uid });
        // Check if the stored OTP exists and matches the user's input
        if (storedOtpObject && storedOtpObject.otp === userEnteredOtp.toString()) {
            const currentTime = Date.now();
            // Check if the OTP has expired (current time is greater than expiration time)
            if (currentTime <= storedOtpObject.time) {
                // Delete the OTP to ensure it can't be used again
                deleteToken(uid);
                return true;
            } else {
                deleteToken(uid);
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        // Handle errors and provide more details
        console.error("Error during OTP verification:", error);
        return false;
    }
};

module.exports = { createToken, getToken, deleteToken, createOtp, checkOtp }