
const mqtt = require('mqtt');
import Device from '../../app/models/Device'
import DeviceType from '../../app/models/DeviceType';
import { handleSend } from '../ws/index';

var options = {
    host: 'broker.hivemq.com',
    port: 1883
}
const client = mqtt.connect(options);

async function mqttconnect() {
    try {
        client.on('connect', async () => {
            console.log('MQTT Connected');
            client.subscribe(['home_iot/create', 'home_iot/state', 'home_iot/delete', 'home_iot/gatewayScan']);
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
                case 'home_iot/control':
                    await handleControl(data);
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
        const device = await Device.findById(stateData.device_id);
        if (device) {
            device.online = stateData.device_online;
            await device.save();
        }
    } catch (error) {
        console.error('Error parsing or processing state request:', error);
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

async function handleControl(data) {
    try {
        const control = data.toString();
        const controlData = JSON.parse(control);
        console.log('Received control data:', controlData);
    } catch (error) {
        console.error('Error parsing or processing control data:', error);
    }
}

const publishDeviceMqtt = (data, topic) => {
    client.publish(topic, JSON.stringify(data), (err) => {
        if (err) {
            console.error("Error publishing:", err);
            callback(err);
        } else {
            console.log("Publisher Successfully!");
        }
    });
}

module.exports = { mqttconnect, publishDeviceMqtt };
