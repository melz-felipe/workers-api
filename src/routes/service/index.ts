import express from "express";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

import { createService, getServiceById, getAllServices } from "@controllers/service";

const router = express.Router();

router.post("/create", getRequestCompany, createService);
router.get("/all", getRequestCompany, getAllServices);
router.get("/:id", getServiceById);

const serviceRouter = router.use("/service", router);

export { serviceRouter };
