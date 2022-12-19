import mongoose from "@database/instance";

export interface IOption {
  name: string;
  price: number;
  duration: number;
  selected: boolean;
}

export interface IOptionsGroup {
  name: string;
  options: IOption[];
}

export interface ISlider {
  name: string;
  min: number;
  max: number;
  pricePerUnit: number;
  durationPerUnit: number;
  selectedAmount: number;
}

export interface ISlidersGroup {
  name: string;
  sliders: ISlider[];
}

interface IPricingModel {
  salesTax: number;
  ratePerHour: number;
  type: "sliders" | "options";
  optionsGroups: IOptionsGroup[];
  slidersGroups: ISlidersGroup[];
}

interface ISubscriptionService {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  pricingModel: IPricingModel;
  serviceId: mongoose.Schema.Types.ObjectId;
  companyId: mongoose.Schema.Types.ObjectId;
}

const optionSchema = new mongoose.Schema<IOption>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  selected: { type: Boolean, required: true },
});

const optionsGroupSchema = new mongoose.Schema<IOptionsGroup>({
  name: { type: String, required: true },
  options: [optionSchema],
});

const sliderSchema = new mongoose.Schema<ISlider>({
  name: { type: String, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  durationPerUnit: { type: Number, required: true },
  selectedAmount: { type: Number, required: true },
});

const slidersGroupSchema = new mongoose.Schema<ISlidersGroup>({
  name: { type: String, required: true },
  sliders: [sliderSchema],
});

const pricingModelSchema = new mongoose.Schema<IPricingModel>({
  salesTax: { type: Number, required: true },
  ratePerHour: { type: Number, required: true },
  type: { type: String, required: true, enum: ["sliders", "options"] },
  optionsGroups: [optionsGroupSchema],
  slidersGroups: [slidersGroupSchema],
});

const subscriptionServiceSchema = new mongoose.Schema<ISubscriptionService>({
  name: { type: String, required: true },
  pricingModel: pricingModelSchema,
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

const SubscriptionService = mongoose.model(
  "SubscriptionService",
  subscriptionServiceSchema
);

export { SubscriptionService, ISubscriptionService };
