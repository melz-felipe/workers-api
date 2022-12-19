import mongoose from "@database/instance";

interface IAppointmentPricing {
  amountPretax: number;
  amountTax: number;
  amountTotal: number;
  duration: number;
}

interface IAppointment {
  companyId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  subscriptionId: mongoose.Schema.Types.ObjectId;
  addressId: mongoose.Schema.Types.ObjectId;
  workerIds: mongoose.Schema.Types.ObjectId[];
  pricing: IAppointmentPricing;
  date: Date;
}

const appointmentPricingSchema = new mongoose.Schema<IAppointmentPricing>({
  amountPretax: { type: Number, required: true },
  amountTax: { type: Number, required: true },
  amountTotal: { type: Number, required: true },
  duration: { type: Number, required: true },
});

const appointmentSchema = new mongoose.Schema<IAppointment>({
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
  workerIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  pricing: appointmentPricingSchema,
  date: { type: Date, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export { Appointment, IAppointment };
