import express from "express";

import { getDateAppointmentsByCompanyId, assignWorkerToAppointment, unassignWorkerFromAppointment } from "@controllers/appointment";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

const router = express.Router();

router.get("/date/:date", getRequestCompany, getDateAppointmentsByCompanyId);
router.post("/assign/:id", assignWorkerToAppointment);
router.post("/unassign/:id", unassignWorkerFromAppointment);

const appointmentRouter = router.use("/appointment", router);

export { appointmentRouter };
