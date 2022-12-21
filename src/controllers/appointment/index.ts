import { Request, Response } from "express";
import { Error } from "mongoose";

import {
  getDateAppointmentsByCompanyId as getDateAppointmentsByCompanyIdService,
  assignWorkerToAppointment as assignWorkerToAppointmentService,
  unassignWorkerFromAppointment as unassignWorkerFromAppointmentService,
  getAppointmentsByUserId as getAppointmentsByUserIdService,
  getAppointmentById as getAppointmentByIdService,
} from "@services/appointment";

export const getDateAppointmentsByCompanyId = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(400).send({ error: "Missing company id" });
    }

    const date = new Date(req.params.date as string);

    const appointments = await getDateAppointmentsByCompanyIdService(
      companyId.toString(),
      date
    );
    return res.status(200).send(appointments);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const assignWorkerToAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const appointmentId = req.params.id;
    const workerId = req.body.workerId;

    const appointment = await assignWorkerToAppointmentService(
      appointmentId,
      workerId
    );
    return res.status(200).send(appointment);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const unassignWorkerFromAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const appointmentId = req.params.id;
    const workerId = req.body.workerId;

    const appointment = await unassignWorkerFromAppointmentService(
      appointmentId,
      workerId
    );

    return res.status(200).send(appointment);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAppointmentsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send({ error: "Missing user id" });
    }

    const appointments = await getAppointmentsByUserIdService(
      userId.toString()
    );
    return res.status(200).send(appointments);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await getAppointmentByIdService(req.params.id);
    if (!appointment)
      return res.status(404).send({ error: "Appointment not found" });
    return res.status(200).send(appointment);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
