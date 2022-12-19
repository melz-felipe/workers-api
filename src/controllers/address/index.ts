import { Request, Response } from "express";
import { Error } from "mongoose";

import {
  createAddress as createAddressService,
  getAddressById as getAddressByIdService,
  getAddressesByUserId as getAddressesByUserIdService,
} from "@services/address";

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;
    const address = await getAddressByIdService(addressId);
    return res.status(200).send(address);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error.DocumentNotFoundError) {
      return res.status(404).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAddressesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const addresses = await getAddressesByUserIdService(userId);
    return res.status(200).send(addresses);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(400).send({ error: "Missing company id" });
    }

    const address = await createAddressService(req.body, companyId.toString());
    return res.status(201).send(address);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error.ValidationError) {
      return res.status(400).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
