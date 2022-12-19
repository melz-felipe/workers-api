import { Appointment, IAppointment } from "@models/appointment";

import { getUserById } from "@services/user";
import { ObjectId } from "mongoose";

export const createAppointment = async (appointment: IAppointment) => {
  const user = await getUserById(appointment.userId as unknown as string);
  if (!user) {
    throw new Error("User not found");
  }

  return await Appointment.create(appointment);
};

export const getAppointmentById = async (id: string) => {
  const appointment = await Appointment.findById(id);

  return appointment;
};

export const getAppointmentsByCompanyId = async (companyId: string) => {
  const appointments = await Appointment.find({
    companyId,
  });

  return appointments;
};

export const getDateAppointmentsByCompanyId = async (
  companyId: string,
  date: Date
) => {
  const dateStart = new Date(new Date(date).setHours(0, 0, 0, 0));
  const dateEnd = new Date(new Date(date).setHours(23, 59, 59, 999));

  const appointments = await Appointment.find({
    companyId,
    date: {
      $gte: dateStart,
      $lte: dateEnd,
    },
  }).populate(["userId", "addressId", "workerIds"]);

  return appointments;
};

export const assignWorkerToAppointment = async (
  appointmentId: string,
  workerId: string
) => {
  const appointment = await getAppointmentById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const workerIds = appointment.workerIds ?? [];

  if (workerIds.includes(workerId as unknown as ObjectId)) {
    throw new Error("Worker already assigned to appointment");
  }

  workerIds.push(workerId as unknown as ObjectId);

  return await Appointment.findByIdAndUpdate(appointmentId, {
    workerIds,
  });
};

export const unassignWorkerFromAppointment = async (
  appointmentId: string,
  workerId: string
) => {
  const appointment = await getAppointmentById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const workerIds = appointment.workerIds ?? [];

  if (!workerIds.includes(workerId as unknown as ObjectId)) {
    throw new Error("Worker not assigned to appointment");
  }

  const newWorkerIds = workerIds.filter(
    (workerId) => workerId !== (workerId as unknown as ObjectId)
  );

  return await Appointment.findByIdAndUpdate(appointmentId, {
    workerIds: newWorkerIds,
  });
};
