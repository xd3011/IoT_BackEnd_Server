import { } from "../../models/Room";

const createRoom = async (req, res) => {
    try {
        const { room_name, hid } = req.body;
        // Assuming Room is your mongoose model
        const newRoom = new Room({
            room_name,
            home_id: hid,
            device_in_room: [],
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
            return res.status(404).json({ message: "No rooms found for the specified home" });
        }
        return res.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const editRoom = async (req, res) => {
    try {
        const { rid } = req.params;
        const { room_name } = req.body;

        // Assuming Room is your mongoose model
        const room = await Room.findById(rid);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.room_name = room_name;
        await room.save();

        return res.status(200).json({ message: "Room updated successfully", updatedRoom: room });
    } catch (error) {
        console.error("Error editing room:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { rid } = req.params;
        // Assuming Room is your mongoose model
        const room = await Room.findByIdAndDelete(rid);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json({ message: "Room deleted successfully", deletedRoom: room });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createRoom, getRoom, editRoom, deleteRoom }