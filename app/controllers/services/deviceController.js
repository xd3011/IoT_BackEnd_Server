import Device from "../../models/Device";
import DeviceType from "../../models/DeviceType";
import { getHomeById } from "./homeController";
import { createNotificationByServer, sendNotification } from "./notificationController";
import publisherDevice from "../devices/deviceController";

const createDevice = async (req, res) => {
    try {
        const { uid } = req.user;
        const { hid, device_name, gateway_code, mac_address, device_type, addr_type, dev_uuid, oob_info, bearer } = req.body;
        const newDevice = new Device({
            device_owner: uid,
            device_in_home: hid,
            device_name,
            mac_address,
            device_type,
            verify: false,
            device_online: false,
            device_data: {}
        });
        let type = await DeviceType.findById(device_type);

        if (type) {
            if (type.name.includes("Gateway")) {
                await publisherDevice.publisherCreateDevice(newDevice, mac_address, type);
            } else {
                newDevice.gateway_code = gateway_code;
                const device = {
                    "action": 4,
                    "addr": mac_address,
                    device_type,
                    addr_type,
                    dev_uuid,
                    oob_info,
                    bearer,
                    device_name,
                };
                await publisherDevice.publisherCreateDevice(device, gateway_code, type);
            }
        }
        await newDevice.save();
        return res.status(201).json({ message: "Device created successfully", device: newDevice });
    } catch (error) {
        console.error("Error creating device:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getDevice = async (req, res) => {
    try {
        const { hid } = req.params;
        // Assuming Device is your mongoose model
        const devices = await Device.find({ device_in_home: hid });
        if (!devices || devices.length === 0) {
            return res.status(404).json({ error: "No devices found for the specified room" });
        }
        return res.status(200).json({ message: "Get Device successfully", devices: devices });
    } catch (error) {
        console.error("Error fetching devices:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getDeviceDetail = async (req, res) => {
    try {
        const { did } = req.params;
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        return res.status(200).json({ message: "Get Device successfully", device: device });
    } catch (error) {
        console.error("Error fetching devices:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editDevice = async (req, res) => {
    try {
        const { did } = req.params;
        const { device_name, gateway_code, mac_address, device_type } = req.body;
        // Assuming Device is your mongoose model
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        device_name && (device.device_name = device_name);
        gateway_code && (device.gateway_code = gateway_code);
        mac_address && (device.mac_address = mac_address);
        device_type && (device.device_type = device_type);
        await device.save();
        return res.status(200).json({ message: "Device updated successfully" });
    } catch (error) {
        console.error("Error editing device:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const changeRoomDevice = async (req, res) => {
    try {
        const { did } = req.params;
        const { rid } = req.body;
        if (!did) {
            return res.status(400).json({ error: "Invalid device ID" });
        }
        const device = await Device.findOne({ _id: did });
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        if (device.device_in_room == rid) {
            return res.status(404).json({ error: "The device is already in this room" })
        }
        if (rid) {
            await Device.updateOne({ _id: device._id }, { device_in_room: rid });
        } else {
            await Device.updateOne({ _id: device._id }, { $unset: { device_in_room: "" } });
        }
        return res.status(200).json({ message: "Device change room successfully" });
    } catch (error) {
        console.error("Error changing device owner:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const changeOwnerDevice = async (req, res) => {
    try {
        const { uid, did } = req.body;
        if (!uid || !did) {
            return res.status(400).json({ message: "Invalid user ID or device ID" });
        }
        const updatedDevice = await Device.findByIdAndUpdate(
            did,
            { device_owner: uid },
        );
        if (!updatedDevice) {
            return res.status(404).json({ message: "Device not found" });
        }
        return res.status(200).json({ message: "Owner changed successfully", updatedDevice });
    } catch (error) {
        console.error("Error changing device owner:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteDevice = async (req, res) => {
    try {
        const { did } = req.params;
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        const type = await DeviceType.findById(device.device_type);
        if (type.name.includes("Gateway")) {
            const subDevices = await Device.find({ mac_address: device.mac_address });
            if (subDevices && subDevices.length === 0) {
                subDevices.map(async (subDevice) => {
                    await Device.deleteOne({ _id: subDevice._id });
                    publisherDevice.publisherDeleteDevice(subDevice, subDevice.gateway_code);
                })
                await publisherDevice.publisherDeleteDevice(device, device.mac_address);
            }
        }
        else {
            await publisherDevice.publisherDeleteDevice(device, device.gateway_code);
        }
        await Device.deleteOne({ _id: did });
        const resHome = await getHomeById(device.device_in_home);
        const notifications = resHome.user_in_home.map(uid => {
            let notification;
            if (type.name.includes("Gateway")) {
                notification = {
                    uid,
                    title: "Gateway deleted",
                    content: `Gateway "${device.device_name}" in "${resHome.home_name}" has been deleted, All device in gateway are deleted`
                }
            }
            else {
                notification = {
                    uid,
                    title: "Device deleted",
                    content: `Device "${device.device_name}" in "${resHome.home_name}" has been deleted`
                }
            }
            createNotificationByServer(notification);
            sendNotification(notification);
        });
        await Promise.all(notifications);
        return res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error("Error deleting device:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteDeviceInHome = async (req, res) => {
    try {
        const { hid } = req.body;
        const devices = await Device.find({ device_in_home: hid });
        if (!devices || devices.length === 0) {
            return res.status(200).json({ message: "No devices found with the specified home_id" });
        }
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            await Device.deleteOne({ _id: device._id });
            publisherDevice.publisherDeleteDevice(device, device.gateway_code);
        }
        return res.status(200).json({ message: "All devices in the home deleted successfully" });
    } catch (error) {
        console.error("Error deleting devices:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteDeviceInRoom = async (req, res) => {
    try {
        const { rid } = req.body;
        const result = await Device.updateMany({ device_in_room: rid }, { $unset: { device_in_room: 1 } });

        if (result.nModified === 0) {
            return res.status(404).json({ error: "No devices found in the room" });
        }
        return res.status(200).json({ message: "Device_in_room field removed from all devices in the room" });
    } catch (error) {
        console.error("Error deleting device_in_room field:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const controlDevice = async (req, res) => {
    try {
        const { did } = req.params;
        const { value } = req.body;
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        };
        device.device_data[0] = {
            value: value,
        };
        device.save();
        publisherDevice.publisherControlDevice(device, device.gateway_code);
        return res.status(200).json({ message: "Control successfully" });
    } catch (error) {
        console.error("Error deleting device:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const gatewayScanDevice = async (req, res) => {
    try {
        const { did } = req.params;
        const { action } = req.body;
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }
        const deviceType = await DeviceType.findById(device.device_type);
        if (!deviceType || !deviceType.name.includes("Gateway")) {
            return res.status(404).json({ error: 'This device is not a gateway' });
        } else {
            publisherDevice.publisherScanDevice(action, device.mac_address);
            return res.status(200).json({ message: "Scan device successfully" });
        }
    } catch (error) {
        console.error("Error scan device:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { createDevice, getDevice, getDeviceDetail, editDevice, deleteDevice, changeOwnerDevice, deleteDeviceInHome, deleteDeviceInRoom, controlDevice, changeRoomDevice, gatewayScanDevice }