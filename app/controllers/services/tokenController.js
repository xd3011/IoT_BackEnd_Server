import { Token } from "../../models/Token";

const createToken = (uid, refreshToken) => {
    const newToken = new Token({
        user_id: uid,
        refresh_token: refreshToken,
    })
    newToken.save();
    console.log("Save Token Success");
}

module.exports = { createToken }