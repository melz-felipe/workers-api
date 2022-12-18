import mongoose from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      companyId?: mongoose.Schema.Types.ObjectId;
    }
  }
}

export {};
