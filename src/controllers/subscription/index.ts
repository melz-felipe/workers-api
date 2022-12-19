import { Request, Response } from "express";

import {
  createSubscription as createSubscriptionService,
  getSubscriptionById as getSubscriptionByIdService,
  getSubscriptions as getAllSubscriptionsService,
} from "@services/subscription";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(400).send({ error: "Missing company id" });
    }

    const { serviceId, userId, selectedOptions, selectedSliders } = req.body;

    const subscription = await createSubscriptionService(
      serviceId,
      companyId.toString(),
      userId,
      selectedOptions,
      selectedSliders
    );
    return res.status(201).send(subscription);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const subscription = await getSubscriptionByIdService(req.params.id);
    if (!subscription)
      return res.status(404).send({ error: "Subscription not found" });
    return res.status(200).send(subscription);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let active = undefined;
    if (req.query.active) {
      if (req.query.active === "true") {
        active = true;
      } else if (req.query.active === "false") {
        active = false;
      }
    }

    const companyId = req.companyId;

    const filterParams = {
      ...(active && { active }),
      ...(companyId && { companyId }),
    };

    const { subscriptions, total, totalPages } =
      await getAllSubscriptionsService(page, limit, filterParams);

    return res.status(200).send({ subscriptions, total, totalPages });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
