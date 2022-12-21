import { Request, Response } from "express";

import {
  createSubscription as createSubscriptionService,
  getSubscriptionById as getSubscriptionByIdService,
  getSubscriptions as getAllSubscriptionsService,
  getSubscriptionsByUserId as getSubscriptionsByUserIdService,
} from "@services/subscription";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(400).send({ error: "Missing company id" });
    }

    const {
      serviceId,
      userId,
      addressId,
      selectedOptions,
      selectedSliders,
      recurrency,
      startDate,
    } = req.body;

    const parsedStartDate = new Date(startDate);
    parsedStartDate.setHours(0, 0, 0, 0);

    const subscription = await createSubscriptionService(
      serviceId,
      companyId.toString(),
      userId,
      addressId,
      selectedOptions,
      selectedSliders,
      recurrency,
      parsedStartDate
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

export const getSubscriptionsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const subscriptions = await getSubscriptionsByUserIdService(userId);
    return res.status(200).send(subscriptions);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
