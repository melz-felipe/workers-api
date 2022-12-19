import { Request, Response } from "express";
import { Error } from "mongoose";

import {
  createUser as createUserService,
  getUserById as getUserByIdService,
  getAllUsers as getAllUsersService,
  getUserByEmail,
  getAllWorkersForCompanyId as getAllWorkersForCompanyIdService,
} from "@services/user";
import { IUser } from "@models/user";

export const createUser =
  (role: IUser["role"]) => async (req: Request, res: Response) => {
    try {
      const companyId = req.companyId;
      if (!companyId) {
        return res.status(400).send({ error: "Missing company id" });
      }

      if (await getUserByEmail(req.body.email)) {
        return res.status(400).send({ error: "User already exists" });
      }

      const user = await createUserService(req.body, role, companyId);
      return res.status(201).send(user);
    } catch (error: unknown) {
      if (error instanceof Error.ValidationError) {
        return res.status(400).send({ error: error.message });
      }
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    return res.status(200).send(user);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { users, total, totalPages } = await getAllUsersService(page, limit);
    return res.status(200).send({ users, total, totalPages });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllWorkersForCompanyId = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(400).send({ error: "Missing company id" });
    }

    const workers = await getAllWorkersForCompanyIdService(
      companyId.toString()
    );

    return res.status(200).send(workers);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
