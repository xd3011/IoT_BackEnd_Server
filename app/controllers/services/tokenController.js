import Token from "../../models/Token";

const createToken = async (uid, refreshToken) => {
    try {
        // Check if a token already exists for the given user
        const token = await Token.findOne({ user_id: uid });

        // If a token already exists, update the refresh_token
        if (token) {
            token.refresh_tokens.push(refreshToken);
            await token.save();
            console.log("Token updated successfully");
            return (token.refresh_tokens.length - 1);
        } else {
            const newToken = new Token({
                user_id: uid,
                refresh_tokens: [],
            });
            newToken.refresh_tokens.push(refreshToken);
            await newToken.save();
            console.log("Token saved successfully");
            return 0;
        }
    } catch (error) {
        console.error("Error creating token:", error);
        // Handle the error accordingly, e.g., logging or returning an error response
        throw error;
    }
}

const getToken = async (uid) => {
    return token = await Token.findOne({ user_id: uid });
}

const deleteToken = async (uid, index) => {
    try {
        const user = await Token.findOne({ user_id: uid });
        if (!user) {
            console.log("User not found");
            return;
        }
        const tokenToDelete = user.refresh_tokens[index];
        user.refresh_tokens.splice(index, 1);
        await user.save();
        console.log("Delete Token Success");
    } catch (error) {
        console.error("Error deleting token:", error);
    }
};

module.exports = { createToken, getToken, deleteToken }