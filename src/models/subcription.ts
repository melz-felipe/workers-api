import mongoose from "@database/instance";

interface ISubscriptionPricing {
  amountPretax: number;
  amountTax: number;
  amountTotal: number;
  duration: number;
}

interface ISubscription {
  companyId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  serviceId: mongoose.Schema.Types.ObjectId; // service template used to create this subscription
  subscriptionServiceId: mongoose.Schema.Types.ObjectId; // active template that is used to generate new appointments
  active: boolean;
  pricing: ISubscriptionPricing;
}

const subscriptionPricingSchema = new mongoose.Schema<ISubscriptionPricing>({
  amountPretax: { type: Number, required: true },
  amountTax: { type: Number, required: true },
  amountTotal: { type: Number, required: true },
  duration: { type: Number, required: true },
});

const subscriptionSchema = new mongoose.Schema<ISubscription>({
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
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  subscriptionServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionService",
  },
  active: {
    type: Boolean,
    default: false,
  },
  pricing: subscriptionPricingSchema,
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export { Subscription, ISubscription };
