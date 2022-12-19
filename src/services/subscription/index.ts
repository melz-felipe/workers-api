import { Subscription, ISubscription } from "@models/subcription";
import { IAppointment } from "@models/appointment";

import { getServiceById } from "@services/service";
import { createSubscriptionService } from "@services/subscriptionService";
import { calculateSubscriptionPrice } from "@services/pricing";
import { createAppointment } from "@services/appointment";

import {
  ISelectedOptions,
  ISelectedSliders,
} from "@services/subscriptionService";
import { ISubscriptionService } from "@models/subscriptionService";

export const createSubscription = async (
  serviceId: string,
  companyId: string,
  userId: string,
  addressId: string,
  selectedOptions: ISelectedOptions[] = [],
  selectedSliders: ISelectedSliders[] = [],
  recurrency: ISubscription["recurrency"] = [],
  startDate: ISubscription["startDate"] = new Date()
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
    addressId: addressId as unknown as ISubscription["addressId"],
    subscriptionServiceId:
      subscriptionService._id as unknown as ISubscription["subscriptionServiceId"],
    active: true,
    pricing: subscriptionPricing,
    recurrency,
    startDate,
  };

  const newSubscription = new Subscription(subscriptionBody);
  await newSubscription.save();

  createSubscriptionAppointments(newSubscription._id.toString());

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

export const createSubscriptionAppointments = async (
  subscriptionId: string
) => {
  const subscription = await getSubscriptionById(subscriptionId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const { startDate, recurrency } = subscription;

  const appointmentDates = recurrency.map((recurrency) => {
    const { dayIndex, hour: recurrencyHour } = recurrency;
    const appointmentDate = new Date(startDate);

    appointmentDate.setDate(appointmentDate.getDate() + dayIndex);

    const [hour, minute, second] = recurrencyHour.split(":").map(Number);

    appointmentDate.setHours(hour, minute, second, 0);

    return appointmentDate;
  });

  appointmentDates.forEach(async (appointmentDate) => {
    await createAppointment({
      subscriptionId:
        subscriptionId as unknown as IAppointment["subscriptionId"],
      companyId: subscription.companyId as unknown as IAppointment["companyId"],
      userId: subscription.userId as unknown as IAppointment["userId"],
      addressId: subscription.addressId as unknown as IAppointment["addressId"],
      date: appointmentDate,
      pricing: subscription.pricing,
      workerIds: [],
    });
  });
};
