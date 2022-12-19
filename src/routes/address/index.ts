import express from "express";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

import {
  getAddressById,
  getAddressesByUserId,
  createAddress,
} from "@controllers/address";

const router = express.Router();

router.post("/create", getRequestCompany, createAddress);
router.get("/user/:id", getAddressesByUserId);
router.get("/:id", getAddressById);

const addressRouter = router.use("/address", router);

export { addressRouter };
