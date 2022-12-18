import mongoose from "@database/instance";
import bcrypt from "bcryptjs";

const SALT_WORK_FACTOR = 10;

import validateEmail from "@validators/email";
import { CallbackError } from "mongoose";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin" | "worker";
  password: string;
  phone: string;
  companyId: mongoose.Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: "Invalid email",
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["customer", "admin", "worker"],
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err: unknown) {
    return next(err as CallbackError);
  }
});

userSchema.methods.validatePassword = async function validatePassword(
  data: string
) {
  return bcrypt.compare(data, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser };
