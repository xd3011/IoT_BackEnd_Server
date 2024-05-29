import DeviceType from "../../models/DeviceType";

const createDeviceType = async (req, res) => {
    const { type, name, image } = req.body;
    const newDeviceType = new DeviceType({
        type,
        name,
        image,
    });
    try {
        await newDeviceType.save();
        return res.status(201).json({ message: "Create Device Type Successfully" });
    } catch (error) {
        console.error("Error during create device type:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getDeviceType = async (req, res) => {
    try {
        const deviceTypes = await DeviceType.find();
        return res.status(200).json({ message: "Device types retrieved successfully", deviceTypes });
    } catch (error) {
        console.error("Error during get device type:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editDeviceType = async (req, res) => {
    const { dtid } = req.params;
    const { type, name, image } = req.body;
    try {
        const deviceType = await DeviceType.findById(dtid);
        if (!deviceType) {
            return res.status(404).json({ error: "Device type not found" });
        }
        if (type) {
            deviceType.type = type;
        }
        if (name) {
            deviceType.name = name;
        }
        if (image) {
            deviceType.image = image;
        }
        await deviceType.save();
        return res.status(200).json({ message: "Update Device Type Successfully" });
    } catch (error) {
        console.error("Error during update device type:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteDeviceType = async (req, res) => {
    const { dtid } = req.params;
    try {
        const deviceType = await DeviceType.findByIdAndDelete(dtid);
        if (!deviceType) {
            return res.status(404).json({ error: "Device type not found" });
        }
        return res.status(200).json({ message: "Device type deleted successfully" });
    } catch (error) {
        console.error("Error during delete device type:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { createDeviceType, getDeviceType, editDeviceType, deleteDeviceType };