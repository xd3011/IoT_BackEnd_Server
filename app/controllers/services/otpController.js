import Otp from "../../models/Otp";

const createOtp = async (uid) => {
    // Generate a random OTP with 6 digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const currentTime = Date.now();
    // Add 5 minutes (300,000 milliseconds) to get the expiration time
    const expirationTime = currentTime + 300000;
    // Create a new Token object with the expiration time
    const OTP = await Otp.findOne({ user_id: uid });
    if (!OTP) {
        const newOtp = new Otp({
            user_id: uid,
            otp: otp,
            time: expirationTime
        })
        newOtp.save();
        return otp;
    }
    OTP.otp = otp;
    OTP.time = expirationTime;
    OTP.save();
    return otp;
};


const checkOtp = async (uid, userEnteredOtp) => {
    try {
        // Find the stored OTP for the given user
        const storedOtpObject = await Otp.findOne({ user_id: uid });
        // Check if the stored OTP exists and matches the user's input
        if (storedOtpObject && storedOtpObject.otp === userEnteredOtp.toString()) {
            const currentTime = Date.now();
            // Check if the OTP has expired (current time is greater than expiration time)
            if (currentTime <= storedOtpObject.time) {
                // Delete the OTP to ensure it can't be used again
                deleteOtp(uid);
                return true;
            } else {
                deleteOtp(uid);
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

const deleteOtp = async (uid) => {
    try {
        const deletedOtp = await Otp.findOneAndDelete({ user_id: uid });
        if (deletedOtp) {
            console.log("Delete Otp Success");
        } else {
            console.log("Otp not found");
        }
    } catch (error) {
        console.error("Error deleting otp:", error);
    }
};

module.exports = { createOtp, checkOtp }