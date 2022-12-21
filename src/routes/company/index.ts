import express from "express";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

import { getCompany, getAllCompanies, createCompany, getCompanyBySubdomain } from "@controllers/company";

const router = express.Router();

router.get('/branding', getRequestCompany, getCompanyBySubdomain);
router.post("/", createCompany);
router.get("/all", getAllCompanies);
router.get("/:id", getCompany);

const companyRouter = router.use("/company", router);

export { companyRouter };
