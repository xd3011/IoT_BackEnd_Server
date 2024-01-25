import mqtt from "../../../configs/mqtt/index";

const publisherCreateDevice = async (device, topic) => {
    try {
        const data = {
            action: "create",
            device_owner: device.device_owner,
            device_in_room: device.device_in_room,
            device_id: device._id,
            mac_address: device.mac_address,
        };
        await mqtt.publishDeviceMqtt(data, topic);
    } catch (error) {
        console.error('Error publishing create device:', error);
        throw error;
    }
}

const publisherDeleteDevice = async (device, topic) => {
    try {
        const data = {
            action: "delete",
            device_owner: device.device_owner,
            device_in_room: device.device_in_room,
            device_id: device._id,
            mac_address: device.mac_address,
        };
        await mqtt.publishDeviceMqtt(data, topic);
    } catch (error) {
        console.error('Error publishing delete device:', error);
        throw error;
    }
}

const publisherMoveDevice = async (device, topic) => {
    try {
        const data = {
            action: "move",
            device_owner: device.device_owner,
            device_in_room: device.device_in_room,
            device_id: device._id,
            mac_address: device.mac_address,
        }
        await mqtt.publishDeviceMqtt(data, topic);
    } catch (error) {
        console.error('Error publishing delete device:', error);
        throw error;
    }
}

const publisherChangeOwnerDevice = async (device, topic) => {
    try {
        const data = {
            action: "change_owner",
            device_owner: device.device_owner,
            device_in_room: device.device_in_room,
            device_id: device._id,
            mac_address: device.mac_address,
        }
        await mqtt.publishDeviceMqtt(data, topic);
    } catch (error) {
        console.error('Error publishing delete device:', error);
        throw error;
    }
}

module.exports = {
    publisherCreateDevice,
    publisherDeleteDevice,
    publisherMoveDevice,
    publisherChangeOwnerDevice,
}
