import express from "express";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

import { createUser, getAllUsers, getUserById, getAllWorkersForCompanyId } from "@controllers/user";

const router = express.Router();

router.post("/create/admin", getRequestCompany, createUser("admin"));
router.post("/create/customer", getRequestCompany, createUser("customer"));
router.post("/create/worker", getRequestCompany, createUser("worker"));
router.get("/all", getAllUsers);
router.get("/workers", getRequestCompany, getAllWorkersForCompanyId);
router.get("/:id", getUserById);

const userRouter = router.use("/user", router);

export { userRouter };
