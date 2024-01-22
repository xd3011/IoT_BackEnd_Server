import Home from "../../models/Home";

const createHome = async (req, res) => {
    try {
        const { uid } = req.user;
        const { address, home_name } = req.body;
        const newHome = new Home({
            address,
            home_name,
            owner: uid,
            user_in_home: uid,
            room_in_home: [],
        });
        await newHome.save();
        return res.status(201).send("Create home successfully");
    } catch (error) {
        console.error("Error creating home:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const getHome = async (req, res) => {
    try {
        const { uid } = req.user;
        // Assuming Home is your mongoose model
        const homes = await Home.find({ user_in_home: uid });
        if (!homes || homes.length === 0) {
            return res.status(404).json({ message: "Home not found for the specified user." });
        }
        return res.json(homes);
    } catch (error) {
        console.error("Error fetching home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
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
            return res.status(404).json({ message: "Home not found" });
        }
        return res.status(200).json({ message: "Home deleted successfully", deletedHome: home });
    } catch (error) {
        console.error("Error deleting home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createHome, getHome, editHome, deleteHome }
