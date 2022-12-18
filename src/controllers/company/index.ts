import { Request, Response } from "express";
import { Error } from "mongoose";

import {
  createCompany as createCompanyService,
  getCompanyById,
  getAllCompanies as getAllCompaniesService,
} from "@services/company";

export const getCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const company = await getCompanyById(companyId);
    return res.status(200).send(company);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error.DocumentNotFoundError) {
      return res.status(404).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { companies, total, totalPages } = await getAllCompaniesService(
      page,
      limit
    );
    return res.status(200).send({ companies, total, totalPages });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await createCompanyService(req.body);
    return res.status(201).send(company);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error.ValidationError) {
      return res.status(400).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
