import mqtt from "../../../configs/mqtt/index";
import Device from "../../models/Device";
import DeviceType from "../../models/DeviceType";

const publisherCreateDevice = async (device, topic, type) => {
    try {
        if (type && type.name.includes("Gateway")) {
            const data = {
                action: 1,
                device_owner: device.device_owner,
                device_in_home: device.device_in_home,
                device_id: device._id,
                device_type: "Gateway",
                mac_address: device.mac_address,
            };
            await mqtt.publishDeviceMqtt(data, topic);
        }
        else if (type) {
            const data = {
                action: 4,
                addr: device.addr,
                addr_type: device.addr_type,
                dev_uuid: device.dev_uuid,
                oob_info: device.oob_info,
                bearer: device.bearer,
                type: type.type.toUpperCase(),
            }
            await mqtt.publishDeviceMqtt(data, topic);
        }
    } catch (error) {
        console.error('Error publishing create device:', error);
        throw error;
    }
}

const publisherDeleteDevice = async (device, topic) => {
    try {
        const type = await DeviceType.findById(device.device_type);
        if (!type) {
            throw new Error('Device type not found');
        }
        if (type.name.includes("Gateway")) {
            const data = {
                action: 10,
            };
            await mqtt.publishDeviceMqtt(data, topic);
        }
        else {
            const data = {
                action: 7,
                addr: device.ble_address,
                type: type.name.toUpperCase(),
            }
            await mqtt.publishDeviceMqtt(data, topic);
        }
    } catch (error) {
        console.error('Error publishing delete device:', error);
        throw error;
    }
}

const publisherControlDevice = async (device, topic) => {
    try {
        const data = {
            action: 5,
            addr: device.ble_address.toString(16),
            state: device.device_data[0].value,
        }
        await mqtt.publishDeviceMqtt(data, topic);
    } catch (error) {
        console.error('Error publishing delete device:', error);
        throw error;
    }
}

const publisherScanDevice = async (action, topic) => {
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
    publisherControlDevice,
    publisherScanDevice,
}
