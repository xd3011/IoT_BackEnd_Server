// Config websocket server
import { WebSocketServer } from "ws";
import url from "url";

const connectionDeviceState = {};
const connectionScanDevice = {};
const connectionDeviceDetail = {};

export const handleSend = (data) => {
    Object.keys(connectionScanDevice).forEach((uid) => {
        const { connection, macAddress } = connectionScanDevice[uid];
        if (macAddress === data.gateway) {
            connection.send(JSON.stringify(data));
        }
    });
};

export const handleSendDeviceState = (user_id, data) => {
    Object.keys(connectionDeviceState).forEach((uid) => {
        if (uid == user_id) {
            const { connection } = connectionDeviceState[uid];
            connection.send(JSON.stringify(data));
        }
    });
};

export const handleSendDeviceData = (device) => {
    Object.keys(connectionDeviceDetail).forEach((uid) => {
        const { connection, macAddress } = connectionDeviceDetail[uid];
        if (macAddress == device.mac_address) {
            connection.send(JSON.stringify(device));
        }
    });

}

const handleClose = (uid, action) => {
    return () => {
        if (action === 'scanDevice') {
            delete connectionScanDevice[uid];
        }
        else if (action === 'deviceState') {
            delete connectionUser[uid];
        } else if (action === 'deviceDetail') {
            delete connectionDeviceDetail[uid];
        }
    };
};

const handleMessage = (message) => {
    console.log(message);
};

export const initWebSocket = (server) => {
    const wsServer = new WebSocketServer({ server: server });

    wsServer.on('connection', (connection, request) => {
        const { macAddress, uid, action } = url.parse(request.url, true).query;
        if (action === "scanDevice") {
            connectionScanDevice[uid] = {
                connection,
                macAddress,
            };
        } else if (action === "deviceState") {
            connectionDeviceState[uid] = { connection };
        } else if (action === "deviceDetail") {
            connectionDeviceDetail[uid] = {
                connection,
                macAddress,
            };
        }
        connection.on('message', (message) => handleMessage(message));
        connection.on('close', () => handleClose(uid, action));
    });
};