import User from '../../models/User';
import Home from '../../models/Home';

const userInHome = async (req, res) => {
    try {
        const { hid } = req.params;
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }
        const users = await Promise.all(home.user_in_home.map(userId => getUser(userId)));
        return res.status(200).json({ users, message: 'Users in home fetched successfully' });
    } catch (error) {
        console.error(`Error fetching users in home: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const addUserToHome = async (req, res) => {
    try {
        const { uid, hid } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
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
        if (home.home_owner === uid) {
            return res.status(403).json({ message: "Cannot remove from the home" });
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

const getAllUser = async (req, res) => {
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

const createAdmin = async (req, res) => {
    try {
        const { email, phone, user_name, pass_word, name } = req.body;
        // Validate that either email or phone is provided
        if (!email && !phone) {
            return res.status(400).json({ error: "Email or phone is required for registration." });
        }
        // Create password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass_word, salt);
        // Create and save User
        const newUser = new User({
            email,
            phone,
            user_name,
            pass_word: hashedPassword,
            verify: email ? false : true, // Set verify to false if email is provided
            role: "admin",
            name,
        });
        await newUser.save();
        return res.status(200).json({ message: "Admin account created successfully" });
    } catch (error) {
        // Handle duplicate user_name error
        if (error.code === 11000 && error.keyPattern.user_name) {
            return res.status(409).json({ error: "Username already exists." });
        }
        console.error("Error in registration:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const changeToAdmin = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "User is already an admin" });
        }
        user.role = "admin";
        await user.save();
        return res.status(200).json({ message: "User role changed to admin successfully", updatedUser: user });
    } catch (error) {
        console.error("Error changing user role to admin:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const getUser = async (uid) => {
    try {
        const user = await User.findById(uid);
        if (!user) {
            // Handle the case when the user is not found, e.g., throw an error or return a meaningful response
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        // Handle other potential errors, log them, or rethrow as needed
        console.error(`Error fetching user: ${error.message}`);
        throw error;
    }
};

module.exports = { userInHome, addUserToHome, deleteUserFromHome, getAllUser, deleteUser, getUser, createAdmin, changeToAdmin }