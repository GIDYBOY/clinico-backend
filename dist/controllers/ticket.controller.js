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
exports.deleteTicket = exports.updateStatus = exports.allTickets = exports.userTickets = exports.getTicketById = exports.create = void 0;
const TicketService = __importStar(require("../services/ticket.service"));
const ticket_validator_1 = require("../validators/ticket.validator");
const create = async (req, res) => {
    const parse = ticket_validator_1.CreateTicketSchema.safeParse(req.body);
    if (!parse.success) {
        res.status(400).json({ error: parse.error.flatten() });
        return;
    }
    const ticket = await TicketService.createTicket(req.user.id, parse.data);
    res.status(201).json(ticket);
};
exports.create = create;
const getTicketById = async (req, res) => {
    const ticketId = req.params.id;
    const ticket = await TicketService.getTicketById(ticketId);
    if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
    }
    res.status(200).json(ticket);
};
exports.getTicketById = getTicketById;
const userTickets = async (req, res) => {
    const tickets = await TicketService.getUserTickets(req.user.id);
    res.status(200).json(tickets);
};
exports.userTickets = userTickets;
const allTickets = async (_req, res) => {
    const tickets = await TicketService.getAllTickets();
    res.status(200).json(tickets);
};
exports.allTickets = allTickets;
const updateStatus = async (req, res) => {
    const { ticketId } = req.params;
    const { status } = req.body;
    const ticket = await TicketService.updateTicketStatus(ticketId, status);
    res.status(200).json(ticket);
};
exports.updateStatus = updateStatus;
const deleteTicket = async (req, res) => {
    const { ticketId } = req.params;
    await TicketService.deleteTicket(ticketId);
    res.status(204).send();
};
exports.deleteTicket = deleteTicket;
