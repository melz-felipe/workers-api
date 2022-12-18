import express from "express";

import { getCompany, getAllCompanies, createCompany } from "@controllers/company";

const router = express.Router();

router.post("/", createCompany);
router.get("/all", getAllCompanies);
router.get("/:id", getCompany);

const companyRouter = router.use("/company", router);

export { companyRouter };
