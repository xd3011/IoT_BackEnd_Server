import User from '../../models/User';
import Home from '../../models/Home';
import bcrypt from "bcrypt";
import { mailSendConfirmAccount } from "../../../utils/mail";


const userInHome = async (req, res) => {
    try {
        const { hid } = req.params;
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }
        const users = await Promise.all(home.user_in_home.map(userId => getUser(userId)));
        const adminId = home.home_owner;
        const homeAdmin = await User.findById(adminId);
        if (!homeAdmin) {
            return res.status(404).json({ error: 'Admin Error' });
        }
        return res.status(200).json({ users, message: 'Users in home fetched successfully', homeAdmin });
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
            return res.status(404).json({ error: "User not found" });
        }
        // Assuming Home is your mongoose model
        const home = await Home.findById(hid);
        home.user_in_home.push(uid);
        await home.save();
        return res.status(200).json({ message: "User added to home successfully", updatedHome: home });
    } catch (error) {
        console.error("Error adding user to home:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUserFromHome = async (req, res) => {
    try {
        const { uid, hid } = req.body;
        // Assuming Home is your mongoose model
        const home = await Home.findById(hid);
        if (home.home_owner === uid) {
            return res.status(403).json({ error: "Cannot remove from the home" });
        }
        const index = home.user_in_home.indexOf(uid);
        if (index !== -1) {
            home.user_in_home.splice(index, 1);
            await home.save();
            return res.status(200).json({ message: "User removed from home successfully", updatedHome: home });
        } else {
            return res.status(404).json({ error: "User not found in home" });
        }
    } catch (error) {
        console.error("Error deleting user from home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllUser = async (req, res) => {
    try {
        let query = {};
        const searchQuery = req.query.search;
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, 'i');
            query = { $or: [{ name: searchRegex }, { email: searchRegex }] };
        }
        const users = await User.find(query);
        if (!users || users.length === 0) {
            return res.status(200).json({ message: "No users found", users: [] });
        }
        return res.status(200).json({ message: "Get user successfully", users: users });
    } catch (error) {
        console.error("Error fetching user(s):", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findByIdAndDelete(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found or already deleted" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const changeToAdmin = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ error: "User is already an admin" });
        }
        user.role = "admin";
        await user.save();
        return res.status(200).json({ message: "User role changed to admin successfully" });
    } catch (error) {
        console.error("Error changing user role to admin:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const changeToUser = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role === "user") {
            return res.status(400).json({ error: "User is already an user" });
        }
        user.role = "user";
        await user.save();
        return res.status(200).json({ message: "User role changed successfully" });
    } catch (error) {
        console.error("Error changing user role:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

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

const getUserProfile = async (req, res) => {
    try {
        const { uid } = req.user;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else {
            return res.status(200).json({ message: 'Get success', user });
        }
    }
    catch {
        console.error("Error changing user role to admin:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editUser = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else {
            const { name, age, gender, email, phone, address, about } = req.body;
            if (name) {
                user.name = name;
            }
            if (age) {
                user.age = age;
            }
            if (gender) {
                user.gender = gender;
            }
            if (email) {
                user.email = email;
                // Confirm Email;
            }
            if (phone) {
                user.phone = phone;
                // Confirm Phone Number
            }
            if (address) {
                user.address = address;
            }
            if (about) {
                user.about = about;
            }
            user.save();
            return res.status(200).json({ message: 'Edit user successfully' });
        }
    } catch {
        console.error("Error save user profile", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { uid } = req.user;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else {
            const { name, age, gender, email, phone, address, about } = req.body;
            if (name) {
                user.name = name;
                await user.save();
                return res.status(200).json({ message: 'Update name successfully' });
            }
            if (age) {
                user.age = age;
                await user.save();
                return res.status(200).json({ message: 'Update age successfully' });
            }
            if (gender) {
                user.gender = gender;
                await user.save();
                return res.status(200).json({ message: 'Update gender successfully' });
            }
            if (email) {
                user.email = email;
                await user.save();
                mailSendConfirmAccount();
                return res.status(200).json({ message: 'Update email successfully' });
            }
            if (phone) {
                user.phone = phone;
                await user.save();
                // Confirm Phone Number
                return res.status(200).json({ message: 'Update phone number successfully' });
            }
            if (address) {
                user.address = address;
                await user.save();
                return res.status(200).json({ message: 'Update address successfully' });
            }
            if (about) {
                user.about = about;
                await user.save();
                return res.status(200).json({ message: 'Update about successfully' });
            }
        }
    } catch {
        console.error("Error save user profile", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { userInHome, addUserToHome, deleteUserFromHome, getAllUser, deleteUser, getUser, changeToAdmin, changeToUser, getUserProfile, updateUserProfile, editUser }