import { sendNotificationByExpo } from "../../../configs/expoNotification";
import Notification from "../../models/Notification";
import User from "../../models/User";

const createNotification = async (req, res) => {
    try {
        const { uid, title, content } = req.body;
        const requiredFields = ['uid', 'title', 'content'];
        const isValid = requiredFields.every(field => req.body[field]);
        if (!isValid) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await User.findById(req.body.uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const notification = new Notification({
            uid,
            title,
            content,
            state: false
        });
        await notification.save();
        return res.status(201).json({ message: "Notification created successfully" });
    } catch (error) {
        console.error("Error during create notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const createNotificationByServer = async (data) => {
    const { uid, title, content } = data
    try {
        const user = await User.findById(uid);
        if (!user) {
            return false;
        }
        const notification = new Notification({
            uid,
            title,
            content,
            state: false
        });
        await notification.save();
        return true;
    } catch (error) {
        console.error("Error during create notification by server:", error);
        return false;
    }
}

const getNotification = async (req, res) => {
    try {
        const { uid } = req.params;
        const lastTimeStamps = new Date();
        lastTimeStamps.setDate(lastTimeStamps.getDate() - 30);
        const notifications = await Notification.find({
            uid: uid,
            createdAt: { $gte: lastTimeStamps }
        });
        await Notification.updateMany({
            uid: uid,
            createdAt: { $gte: lastTimeStamps }
        }, {
            $set: { state: true }
        });
        return res.status(200).json({ notifications, messages: "Get notification successfully" });
    } catch (error) {
        console.error("Error during get notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editNotification = async (req, res) => {
    try {
        const { nid } = req.params;
        const { title, content } = req.body;
        const notification = await Notification.findByIdAndUpdate(nid, { title: title, content: content });
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification edited successfully" });
    } catch (error) {
        console.error("Error during edit notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { nid } = req.params;
        const notification = await Notification.findByIdAndDelete(nid);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error during delete notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const sendNotification = async (data) => {
    try {
        const { uid, title, content } = data;
        const user = await User.findById(uid);
        if (!user) {
            return false;
        }
        await Promise.all(user.tokenNotification.map(token =>
            sendNotificationByExpo(token, title, content)
        ));
        return true;
    } catch (error) {
        console.error("Error during create notification by server:", error);
        return false;
    }
}

module.exports = { createNotification, getNotification, editNotification, deleteNotification, createNotificationByServer, sendNotification }