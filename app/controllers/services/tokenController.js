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

module.exports = { createToken, getToken, deleteToken }