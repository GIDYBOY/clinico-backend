


interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'doctor' | 'patient';
    profileImage?: string;
}

interface Doctor extends User {
    department: string;
    specialization: string;
    appointments: Appointment[];
}


interface Patient extends User {
    healthRecords: HealthRecord[];
    appointments: Appointment[];
    invoices: Invoice[];
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  description?: string;
}

interface Invoice {
  id: string;
  patientId: string;
  amount: number;
  services: string[];
  status: "paid" | "unpaid";
}

interface HealthRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  description: string;
  prescriptions: string[];
}