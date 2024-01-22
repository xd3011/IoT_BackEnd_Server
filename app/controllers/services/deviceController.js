import Device from "../../models/Device";

const createDevice = async (req, res) => {
    try {
        const { uid } = req.user;
        const { rid, device_name, gateway_code, mac_address, device_type } = req.body;
        // Assuming Device is your mongoose model
        const newDevice = new Device({
            device_owner: uid,
            device_in_room: rid,
            device_name,
            gateway_code,
            mac_address,
            device_type,
            verify: false,
            device_online: false,
            device_data: {}
        });
        await newDevice.save();
        return res.status(201).json({ message: "Device created successfully", newDevice });
    } catch (error) {
        console.error("Error creating device:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getDevice = async (req, res) => {
    try {
        const { rid } = req.params;
        // Assuming Device is your mongoose model
        const devices = await Device.find({ device_in_room: rid });
        if (!devices || devices.length === 0) {
            return res.status(404).json({ message: "No devices found for the specified room" });
        }
        return res.json(devices);
    } catch (error) {
        console.error("Error fetching devices:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const editDevice = async (req, res) => {
    try {
        const { did } = req.params;
        const { device_in_room, device_name, gateway_code, mac_address, device_type } = req.body;
        // Assuming Device is your mongoose model
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        device.device_in_room = device_in_room;
        device.device_name = device_name;
        device.gateway_code = gateway_code;
        device.mac_address = mac_address;
        device.device_type = device_type;
        await device.save();
        return res.status(200).json({ message: "Device updated successfully", updatedDevice: device });
    } catch (error) {
        console.error("Error editing device:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteDevice = async (req, res) => {
    try {
        const { did } = req.params;
        // Assuming Device is your mongoose model
        const device = await Device.findByIdAndDelete(did);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        return res.status(200).json({ message: "Device deleted successfully", deletedDevice: device });
    } catch (error) {
        console.error("Error deleting device:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { createDevice, getDevice, editDevice, deleteDevice }