
const mqtt = require('mqtt');
import Device from '../../app/models/Device'
import DeviceType from '../../app/models/DeviceType';
import Home from '../../app/models/Home';
import { handleSend, handleSendDeviceData, handleSendDeviceState } from '../ws/index';
const cron = require('node-cron');

var options = {
    host: 'broker.hivemq.com',
    port: 1883
}
const client = mqtt.connect(options);

const waitingDevices = {};

async function mqttconnect() {
    try {
        client.on('connect', async () => {
            console.log('MQTT Connected');
            client.subscribe(['home_iot/create', 'home_iot/state', 'home_iot/data', 'home_iot/delete', 'home_iot/gatewayScan']);

            cron.schedule('*/30 * * * * *', async () => {
                const types = await DeviceType.find({ name: { $regex: 'Gateway' } });
                const devices = await Device.find({ device_type: { $in: types.map(type => type._id) } });
                devices.map((device) => {
                    const data = { action: 9 };
                    publishDeviceMqtt(data, device.mac_address);
                    waitingDevices[device.mac_address] = setTimeout(async () => {
                        device.device_online = false;
                        device.save();
                        handleSendState(device);
                        const devices = await Device.find({ gateway_code: device.mac_address });
                        devices.map((device) => {
                            if (device.device_online === false) return;
                            else {
                                device.device_online = false;
                                device.save();
                                handleSendState(device);
                            }
                        });
                        delete waitingDevices[device.mac_address];
                    }, 5000);
                })
            });
        });

        client.on('message', async (topic, data) => {
            switch (topic) {
                case 'home_iot/gatewayScan':
                    handleGatewayScan(data);
                    break;
                case 'home_iot/create':
                    await handleCreate(data);
                    break;
                case 'home_iot/state':
                    await handleState(data);
                    break;
                case 'home_iot/data':
                    await handleData(data);
                    break;
                case 'home_iot/delete':
                    await handleDelete(data);
                    break;
                default:
                    console.log('Unknown topic:', topic);
            }
        });

    } catch (error) {
        console.error('fallmqtt', error);
    }
}

const handleGatewayScan = (data) => {
    try {
        const scan = data.toString();
        const scanData = JSON.parse(scan);
        handleSend(scanData);
    } catch (error) {
        console.error('Error parsing or processing scan request:', error);
    }
}

async function handleCreate(data) {
    try {
        const create = data.toString();
        const createData = JSON.parse(create);
        const device = await Device.findOne({ mac_address: createData.mac_address });
        if (device) {
            device.verify = true;
            device.device_online = true;
            let type = await DeviceType.findById(device.device_type);
            if (type && !type.name.includes("Gateway")) {
                device.ble_address = createData.unicast_addr;
                device.device_data = { value: 1 };
            }
            else if (type && type.name.includes("Gateway")) { }
            await device.save();
        }
    } catch (error) {
        console.error('Error parsing or processing create request:', error);
    }
}

async function handleState(data) {
    try {
        const state = data.toString();
        const stateData = JSON.parse(state);
        if (waitingDevices[stateData.mac_address]) {
            clearTimeout(waitingDevices[stateData.mac_address]);
            delete waitingDevices[stateData.mac_address];
        }
        const device = await Device.findOne({ mac_address: stateData.mac_address });
        if (device) {
            if (device.device_online !== stateData.state || waitingDevices[stateData.mac_address] !== undefined) {
                device.device_online = stateData.state;
                await device.save();
                handleSendState(device);
            }
        }
    } catch (error) {
        console.error('Error parsing or processing device state:', error);
    }
}

async function handleSendState(device) {
    const home = await Home.findById(device.device_in_home);
    if (!home) {
        return;
    }
    home.user_in_home.map((uid) => {
        handleSendDeviceState(uid, device);
    })
}

async function handleData(data) {
    try {
        const dataUpdate = data.toString();
        const jsonData = JSON.parse(dataUpdate);
        const device = await Device.findOne({ mac_address: jsonData.mac_address });
        if (device) {
            device.device_data.unshift({
                temperature: jsonData.data.temperature,
                humidity: jsonData.data.humidity,
                timestamp: new Date()
            });
            device.device_data = device.device_data.slice(0, 10);
            device.device_online = true;
            handleSendDeviceData(device);
            await device.save();
        }
    } catch (error) {
        console.error('Error parsing or processing control data:', error);
    }
}
async function handleDelete(data) {
    try {
        const deletes = data.toString();
        const deleteData = JSON.parse(deletes);
        const existingDevice = await Device.findById(deleteData.device_id);
        if (existingDevice) {
            const result = await Device.findByIdAndDelete(deleteData.device_id);
            console.log('Device deleted successfully:', result);
        } else {
            console.log('Device not found for deletion');
        }
    } catch (error) {
        console.error('Error parsing or processing delete request:', error);
    }
}

const publishDeviceMqtt = (data, topic) => {
    client.publish(topic, JSON.stringify(data), (err) => {
        if (err) {
            console.error("Error publishing:", err);
            callback(err);
        } else {
            // console.log("Publisher Successfully!");
        }
    });
}

module.exports = { mqttconnect, publishDeviceMqtt };
