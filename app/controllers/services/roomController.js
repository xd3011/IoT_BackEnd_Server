import Room from "../../models/Room";

const createRoom = async (req, res) => {
    try {
        const { room_name, hid } = req.body;
        // Assuming Room is your mongoose model
        const newRoom = new Room({
            room_name,
            home_id: hid,
        });
        await newRoom.save();
        return res.status(201).json({ message: "Room created successfully" });
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getRoom = async (req, res) => {
    try {
        const { hid } = req.params;
        // Assuming Room is your mongoose model
        const rooms = await Room.find({ home_id: hid });
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ error: "No rooms found for the specified home" });
        }
        return res.status(200).json({ message: "Success!", rooms: rooms });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getRoomDetails = async (req, res) => {
    try {
        const { rid } = req.params;
        const room = await Room.findOne({ _id: rid });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        return res.status(200).json({ room: room, message: "Get Room Success" });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editRoom = async (req, res) => {
    try {
        const { rid } = req.params;
        const { room_name } = req.body;

        // Assuming Room is your mongoose model
        const room = await Room.findById(rid);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        room.room_name = room_name;
        await room.save();

        return res.status(200).json({ message: "Room updated successfully" });
    } catch (error) {
        console.error("Error editing room:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { rid } = req.params;
        // Assuming Room is your mongoose model
        const room = await Room.findByIdAndDelete(rid);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteRoomInHome = async (req, res) => {
    try {
        const { hid } = req.body;
        const result = await Room.deleteMany({ home_id: hid });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No rooms found with the specified home_id" });
        }
        return res.status(200).json({ message: "All rooms in the home deleted successfully" });
    } catch (error) {
        console.error("Error deleting rooms:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createRoom, getRoom, editRoom, deleteRoom, deleteRoomInHome, getRoomDetails }