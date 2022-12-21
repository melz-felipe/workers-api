import express from "express";

import { getRequestCompany } from "@middlewares/subdomainIsolator";

import { createSubscription, getSubscriptionById, getAllSubscriptions, getSubscriptionsByUserId } from "@controllers/subscription";

const router = express.Router();

router.post("/create", getRequestCompany, createSubscription);
router.get("/user/:userId", getSubscriptionsByUserId);
router.get("/all", getAllSubscriptions);
router.get("/:id", getSubscriptionById);

const subscriptionRouter = router.use("/subscription", router);

export { subscriptionRouter };
