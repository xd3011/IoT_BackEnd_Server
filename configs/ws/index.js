// Config websocket server
import { WebSocketServer } from "ws";
import url from "url";

const connectionUser = {};
const connectionScanDevice = {};

export const handleSend = (data) => {
    Object.keys(connectionScanDevice).forEach((uid) => {
        const { connection, macAddress } = connectionScanDevice[uid];
        if (macAddress === data.gateway) {
            connection.send(JSON.stringify(data));
        }
    });
};

const handleClose = (uid, action) => {
    return () => {
        if (action === 'scanDevice') {
            delete connectionScanDevice[uid];
        }
        else if (action === 'notification') {
            delete connectionUser[uid];
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
        } else if (action === "notification") {
            connectionUser[uid] = connection;
        }
        connection.on('message', (message) => handleMessage(message));
        connection.on('close', () => handleClose(uid, action));
    });
};