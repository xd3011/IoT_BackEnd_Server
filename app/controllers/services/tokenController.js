import { Token } from "../../models/Token";

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

const deleteToken = (uid) => {

}

module.exports = { createToken, getToken, deleteToken }