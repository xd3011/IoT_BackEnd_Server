import User from '../../models/User';
import Home from '../../models/Home';

const addUserFromHome = async (req, res) => {
    try {
        const { uid, hid } = req.body;
        // Assuming Home is your mongoose model
        const home = await Home.findById(hid);
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

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        // Always check for an empty array, not just "truthiness"
        if (!users || users.length === 0) {
            return res.status(200).json({ message: "No users found", users: [] });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching user(s):", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findByIdAndDelete(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }
        return res.status(200).json({ message: "User deleted successfully", deletedUser: user });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { addUserFromHome, deleteUserFromHome, getUser, deleteUser }