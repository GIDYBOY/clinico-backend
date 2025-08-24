"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.toggleRead = exports.read = exports.inbox = exports.send = void 0;
const MessageService = __importStar(require("../services/message.service"));
const send = async (req, res) => {
    const senderId = req.user?.id;
    const { receiverId, subject, content } = req.body;
    if (!senderId) {
        res.status(401).json({ error: "Unauthorized: sender not found" });
        return;
    }
    if (!receiverId || !content) {
        res.status(400).json({ error: "receiverId and content are required" });
        return;
    }
    const message = await MessageService.sendMessage(senderId, receiverId, subject, content);
    res.status(201).json(message);
};
exports.send = send;
const inbox = async (req, res) => {
    const inbox = await MessageService.getInbox(req.user.id);
    res.json(inbox);
};
exports.inbox = inbox;
const read = async (req, res) => {
    const { id } = req.params;
    const message = await MessageService.markAsRead(id);
    res.json(message);
};
exports.read = read;
const toggleRead = async (req, res) => {
    const { id } = req.params;
    const { read } = req.body;
    if (typeof read !== "boolean") {
        res.status(400).json({ error: "read must be true or false" });
        return;
    }
    const updated = await MessageService.toggleReadStatus(id, read);
    if (!updated) {
        res.status(404).json({ error: "Message not found" });
        return;
    }
    res.json(updated);
};
exports.toggleRead = toggleRead;
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const deleted = await MessageService.deleteMessage(id);
    if (!deleted) {
        res.status(404).json({ error: "Message not found" });
        return;
    }
    res.status(204).send();
};
exports.deleteMessage = deleteMessage;
