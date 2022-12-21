import express from "express";

import {
  getDateAppointmentsByCompanyId,
  assignWorkerToAppointment,
  unassignWorkerFromAppointment,
  getAppointmentsByUserId,
  getAppointmentById,
} from "@controllers/appointment";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

const router = express.Router();

router.get("/user/:userId", getRequestCompany, getAppointmentsByUserId);
router.get("/date/:date", getRequestCompany, getDateAppointmentsByCompanyId);
router.post("/assign/:id", assignWorkerToAppointment);
router.post("/unassign/:id", unassignWorkerFromAppointment);
router.get("/:id", getAppointmentById);

const appointmentRouter = router.use("/appointment", router);

export { appointmentRouter };
