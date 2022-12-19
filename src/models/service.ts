import mongoose from "@database/instance";

interface IOption {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  duration: number;
}

interface IOptionsGroup {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  options: IOption[];
}

interface ISlider {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  min: number;
  max: number;
  pricePerUnit: number;
  durationPerUnit: number;
}

interface ISlidersGroup {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  sliders: ISlider[];
}

interface IPricingModel {
  _id: mongoose.Schema.Types.ObjectId;
  salesTax: number;
  ratePerHour: number;
  type: "sliders" | "options";
  optionsGroups: IOptionsGroup[];
  slidersGroups: ISlidersGroup[];
}

interface IService {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  pricingModel: IPricingModel;
  companyId: mongoose.Schema.Types.ObjectId;
  active: boolean;
}

const optionSchema = new mongoose.Schema<IOption>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
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
});

const slidersGroupSchema = new mongoose.Schema<ISlidersGroup>({
  name: { type: String, required: true },
  sliders: [sliderSchema],
});

const pricingModelSchema = new mongoose.Schema<IPricingModel>({
  salesTax: { type: Number, required: true },
  type: { type: String, required: true, enum: ["sliders", "options"] },
  ratePerHour: { type: Number, required: true },
  optionsGroups: [optionsGroupSchema],
  slidersGroups: [slidersGroupSchema],
});

const serviceSchema = new mongoose.Schema<IService>({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  name: { type: String, required: true },
  pricingModel: pricingModelSchema,
  active: { type: Boolean, default: true },
});

const Service = mongoose.model("Service", serviceSchema);

export { Service, IService };
