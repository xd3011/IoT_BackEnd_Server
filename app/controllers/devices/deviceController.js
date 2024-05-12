import mqtt from "../../../configs/mqtt/index";

const publisherCreateDevice = async (device, topic) => {
    try {
        if (device.device_type === 0 || device.device_type === 1) {
            const data = {
                action: 4,
                addr: device.addr,
                addr_type: device.addr_type,
                dev_uuid: device.dev_uuid,
                oob_info: device.oob_info,
                bearer: device.bearer,
                // device_name: device.device_name,
            }
            await mqtt.publishDeviceMqtt(data, topic);
        }
        else {
            const data = {
                action: 1,
                device_owner: device.device_owner,
                device_in_home: device.device_in_home,
                device_id: device._id,
                device_type: device.device_type,
                mac_address: device.mac_address,
                // device_name: device.device_name,
            };
            await mqtt.publishDeviceMqtt(data, topic);
        }
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

const publisherControlDevice = async (device, topic) => {
    try {
        const data = {
            action: 'control',
            mac_address: device.mac_address,
            device_type: device.device_type,
            device_data: device.device_data,
        }
        await mqtt.publishDeviceMqtt(data, topic);
    } catch (error) {
        console.error('Error publishing delete device:', error);
        throw error;
    }
}

const publisherScanDevice = async (action, topic) => {
    console.log('publisherScanDevice', action, topic);
    try {
        const data = {
            action: action,
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
    publisherControlDevice,
    publisherScanDevice,
}
