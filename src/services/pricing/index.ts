import { ISubscriptionService } from "@models/subscriptionService";

import { roundToTwo } from "@utils/index";

export const calculateSubscriptionPrice = (
  subscriptionService: ISubscriptionService
) => {
  const { pricingModel } = subscriptionService;

  const { ratePerHour, salesTax } = pricingModel;

  if (pricingModel.type === "options") {
    const { optionsGroups } = pricingModel;

    const selectedOptions = optionsGroups.flatMap((group) =>
      group.options.filter((option) => option.selected)
    );

    const totalLength = selectedOptions.reduce(
      (total, option) => total + option.duration,
      0
    );

    const subTotalPrice = roundToTwo(
      selectedOptions.reduce((subtotal, option) => subtotal + option.price, 0)
    );

    const totalSalesTax = roundToTwo(subTotalPrice * salesTax);
    const totalPrice = subTotalPrice + totalSalesTax;

    return {
      amountPretax: subTotalPrice,
      amountTax: totalSalesTax,
      amountTotal: totalPrice,
      duration: totalLength,
    };
  } else if (pricingModel.type === "sliders") {
    const { slidersGroups } = pricingModel;

    const selectedSliders = slidersGroups.flatMap((group) =>
      group.sliders.filter((slider) => slider.selectedAmount > 0)
    );

    const totalLength = selectedSliders.reduce(
      (total, slider) => total + slider.durationPerUnit * slider.selectedAmount,
      0
    );

    const subTotalPrice = selectedSliders.reduce(
      (subtotal, slider) =>
        subtotal +
        ratePerHour *
          slider.selectedAmount *
          slider.durationPerUnit *
          slider.pricePerUnit,
      0
    );

    const totalSalesTax = subTotalPrice * salesTax;
    const totalPrice = subTotalPrice + totalSalesTax;

    return {
      amountPretax: subTotalPrice,
      amountTax: totalSalesTax,
      amountTotal: totalPrice,
      duration: totalLength,
    };
  } else {
    throw "Invalid pricing model type";
  }
};
