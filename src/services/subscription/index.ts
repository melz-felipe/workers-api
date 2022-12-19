import { Subscription, ISubscription } from "@models/subcription";

import { getServiceById } from "@services/service";
import { createSubscriptionService } from "@services/subscriptionService";
import { calculateSubscriptionPrice } from "@services/pricing";

import {
  ISelectedOptions,
  ISelectedSliders,
} from "@services/subscriptionService";
import { ISubscriptionService } from "@models/subscriptionService";

export const createSubscription = async (
  serviceId: string,
  companyId: string,
  userId: string,
  selectedOptions: ISelectedOptions[] = [],
  selectedSliders: ISelectedSliders[] = []
) => {
  const service = await getServiceById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  const hasSelectedOptions = selectedOptions.some((option) => option.selected);

  const hasSelectedSliders = selectedSliders.some(
    (slider) => slider.selectedAmount > 0
  );

  if (!hasSelectedOptions && !hasSelectedSliders) {
    throw new Error("No options or sliders selected");
  }

  let subscriptionService: ISubscriptionService;

  try {
    subscriptionService = await createSubscriptionService(
      selectedOptions,
      selectedSliders,
      serviceId,
      companyId
    );
  } catch (error) {
    console.error(error);
    throw "Error when creating subscriptionService";
  }

  const subscriptionPricing = calculateSubscriptionPrice(subscriptionService);

  const subscriptionBody: ISubscription = {
    serviceId: serviceId as unknown as ISubscription["serviceId"],
    companyId: companyId as unknown as ISubscription["companyId"],
    userId: userId as unknown as ISubscription["userId"],
    subscriptionServiceId:
      subscriptionService._id as unknown as ISubscription["subscriptionServiceId"],
    active: true,
    pricing: subscriptionPricing,
  };

  const newSubscription = new Subscription(subscriptionBody);
  await newSubscription.save();

  return newSubscription;
};

export const getSubscriptionById = async (id: string) => {
  const subscription = await Subscription.findById(id);

  return subscription;
};

export const getSubscriptions = async (
  page: number,
  limit: number,
  filterParams?: Partial<ISubscription>
) => {
  const subscriptionsFilterParams = filterParams ?? {};

  const subscriptions = await Subscription.find(subscriptionsFilterParams);
  const total = subscriptions.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const paginatedSubscriptions = subscriptions.slice(offset, offset + limit);

  return {
    subscriptions: paginatedSubscriptions,
    totalPages,
    total,
  };
};
