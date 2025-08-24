"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.createRecord = exports.getRecordsForPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});
const getRecordsForPatient = async (patientId) => {
    return prisma.healthRecord.findMany({
        where: { patientId },
        orderBy: { date: "desc" },
    });
};
exports.getRecordsForPatient = getRecordsForPatient;
const createRecord = async (patientId, record, image = "") => {
    return prisma.healthRecord.create({
        data: {
            patientId,
            record,
            image
        },
    });
};
exports.createRecord = createRecord;
const deleteRecord = async (id) => {
    return prisma.healthRecord.delete({
        where: { id },
    });
};
exports.deleteRecord = deleteRecord;
