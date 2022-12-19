import { Request, Response } from "express";
import { Error } from "mongoose";

import {
  createService as createServiceService,
  getAllServices as getAllServicesService,
  getServiceById as getServiceByIdService,
} from "@services/service";

export const createService = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(400).send({ error: "Missing company id" });
    }

    const {
      body: { pricingModel },
    } = req;

    if (pricingModel?.type === "options") {
      if (
        !pricingModel?.optionsGroups ||
        pricingModel.optionsGroups.length === 0
      ) {
        return res
          .status(400)
          .send({ error: "No pricing model options provided" });
      }
    } else if (pricingModel?.type === "sliders") {
      if (
        !pricingModel?.slidersGroups ||
        pricingModel.slidersGroups.length === 0
      ) {
        return res
          .status(400)
          .send({ error: "No pricing sliders groups provided" });
      }
    } else {
      return res.status(400).send({ error: "Invalid pricing model type" });
    }

    const service = await createServiceService(req.body, companyId);
    return res.status(201).send(service);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error.ValidationError) {
      return res.status(400).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await getServiceByIdService(req.params.id);
    if (!service) return res.status(404).send({ error: "Service not found" });
    return res.status(200).send(service);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllServices = async (req: Request, res: Response) => {
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

    const { services, total, totalPages } = await getAllServicesService(
      page,
      limit,
      filterParams
    );

    return res.status(200).send({ services, total, totalPages });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
