import mongoose from "@database/instance";

interface IAddress {
  companyId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  latitude: number;
  longitude: number;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  postalCode: string;
}

const addressSchema = new mongoose.Schema<IAddress>({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  latitude: {
    type: Number,
    default: 0,
  },
  longitude: {
    type: Number,
    default: 0,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  complement: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
});

const Address = mongoose.model("Address", addressSchema);

export { Address, IAddress };
