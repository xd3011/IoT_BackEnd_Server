import jwt from "jsonwebtoken";

// Generate Access Token
const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        {
            uid: user.id,
            user_name: user.user_name,
            role: user.role,
        },
        process.env.JWT_ACCESS_KEY,
        {
            expiresIn: "1d",
        }
    );
    return accessToken;
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        {
            uid: user.id,
            user_name: user.user_name,
            role: user.role,
        },
        process.env.JWT_REFRESH_KEY,
        {
            expiresIn: "30d", // 30 days
        }
    );
    return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
