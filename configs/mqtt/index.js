
const mqtt = require('mqtt');
import Device from '../../app/models/Device'

var options = {
    host: 'broker.hivemq.com',
    port: 1883
}
const client = mqtt.connect(options);

async function mqttconnect() {
    try {
        client.on('connect', async () => {
            console.log('MQTT Connected');
            client.subscribe(['home_iot/create', 'home_iot/state', 'home_iot/delete']);
        });

        client.on('message', async (topic, data) => {
            switch (topic) {
                case 'home_iot/create':
                    await handleCreate(data);
                    break;
                case 'home_iot/state':
                    await handleState(data);
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

async function handleCreate(data) {
    try {
        const create = data.toString();
        const createData = JSON.parse(create);
        const device = await Device.findById(createData.device_id);
        if (device) {
            device.verify = true;
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

const publishDeviceMqtt = (data, topic) => {
    client.publish(topic, JSON.stringify(data))
        .then(() => {
            console.log("Publisher Successfully!");
        })
        .catch((err) => {
            throw err
        })
}

module.exports = { mqttconnect, publishDeviceMqtt };
