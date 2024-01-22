import User from '../../models/User';
import Home from '../../models/Home';

const addUserFromHome = async (req, res) => {
    try {
        const { uid, hid } = req.body;
        // Assuming Home is your mongoose model
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ message: "Home not found" });
        }
        home.user_in_home.push(uid);
        await home.save();
        return res.status(200).json({ message: "User added to home successfully", updatedHome: home });
    } catch (error) {
        console.error("Error adding user to home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUserFromHome = async (req, res) => {
    try {
        const { uid, hid } = req.body;
        // Assuming Home is your mongoose model
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ message: "Home not found" });
        }
        const index = home.user_in_home.indexOf(uid);
        if (index !== -1) {
            home.user_in_home.splice(index, 1);
            await home.save();
            return res.status(200).json({ message: "User removed from home successfully", updatedHome: home });
        } else {
            return res.status(404).json({ message: "User not found in home" });
        }
    } catch (error) {
        console.error("Error deleting user from home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { addUserFromHome, deleteUserFromHome }