import Home from "../../models/Home";

const createHome = async (req, res) => {
    try {
        const { uid } = req.user;
        const { address, home_name } = req.body;
        // Create a new Home instance with an empty user_in_home array
        const newHome = new Home({
            address,
            home_name,
            home_owner: uid,
            user_in_home: [],
        });
        // Save the new home to the database
        await newHome.save();
        // Add the owner (current user) to the user_in_home array
        newHome.user_in_home.push(uid);
        // Save the updated home to the database
        await newHome.save();
        return res.status(201).send({ message: "Create home successfully" });
    } catch (error) {
        console.error("Error creating home:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

const getHome = async (req, res) => {
    try {
        const { uid } = req.user;
        // Assuming Home is your mongoose model
        const homes = await Home.find({ user_in_home: uid });
        if (!homes || homes.length === 0) {
            // return res.status(404).json({ message: "Home not found for the specified user." });
            return res.status(200).json({ message: "You don't have any homes. Please create a new home." });
        }
        return res.status(200).json({ message: "Success!", homes: homes });
    } catch (error) {
        console.error("Error fetching home:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const editHome = async (req, res) => {
    try {
        const { hid } = req.params;
        const { home_name, address } = req.body;
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ message: "Home not found" });
        }
        home.home_name = home_name;
        home.address = address;
        await home.save();
        return res.status(200).json({ message: "Home updated successfully", home });
    } catch (error) {
        console.error("Error editing home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteHome = async (req, res) => {
    try {
        const { hid } = req.params;
        // Assuming Home is your mongoose model
        const home = await Home.findByIdAndDelete(hid);
        if (!home) {
            return res.status(404).json({ error: "Home not found" });
        }
        return res.status(200).json({ message: "Home deleted successfully", deletedHome: home });
    } catch (error) {
        console.error("Error deleting home:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createHome, getHome, editHome, deleteHome }
