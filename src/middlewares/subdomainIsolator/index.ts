import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { getCompanyBySubdomain } from "@services/company";

export const getRequestCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hostname = req.hostname;

  const subdomain = hostname.split(".")[0];

  try {
    const company = await getCompanyBySubdomain(subdomain);
    if (!company) return res.status(404).send({ error: "Company not found" });
    req.companyId = company._id as unknown as mongoose.Schema.Types.ObjectId;
    next();
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
