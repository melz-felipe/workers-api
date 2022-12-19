import { IService } from "@models/service";
import {
  SubscriptionService,
  ISubscriptionService,
} from "@models/subscriptionService";

import { getServiceById } from "@services/service";

export interface ISelectedOptions {
  optionId: string;
  selected: boolean;
}

export interface ISelectedSliders {
  sliderId: string;
  selectedAmount: number;
}

export const createSubscriptionService = async (
  selectedOptions: ISelectedOptions[],
  selectedSliders: ISelectedSliders[],
  serviceId: string,
  companyId: string
) => {
  let service = (await getServiceById(serviceId)) as IService;

  if (!service) {
    throw new Error("Service not found");
  }

  service = JSON.parse(JSON.stringify(service)) as IService;

  const hasSelectedOptions = selectedOptions.some((option) => option.selected);
  const hasSelectedSliders = selectedSliders.some(
    (slider) => slider.selectedAmount > 0
  );

  if (!hasSelectedOptions && !hasSelectedSliders) {
    throw new Error("No options or sliders selected");
  }

  const selectedOptionsAmount = selectedOptions.filter(
    (option) => option.selected
  ).length;
  const selectedSlidersAmount = selectedSliders.filter(
    (slider) => slider.selectedAmount > 0
  ).length;

  let parsedOptions = 0;
  let parsedSliders = 0;

  const updatedPricingModel = { ...service.pricingModel };

  if (service.pricingModel.type === "options") {
    const serviceOptionsGroups = [...service.pricingModel.optionsGroups];

    const selectedServicesOptions = selectedOptions.filter(
      (option) => option.selected
    );

    const selectedServicesOptionsIds = selectedServicesOptions.map(
      (option) => option.optionId
    );

    updatedPricingModel.optionsGroups = serviceOptionsGroups.map((group) => {
      const options = group.options.map((option) => {
        const selected = selectedServicesOptionsIds.includes(
          option._id.toString()
        );

        if (selected) {
          parsedOptions += 1;
        }

        return {
          ...option,
          selected,
        };
      });

      return {
        ...group,
        options,
      };
    });
  } else if (service.pricingModel.type === "sliders") {
    const serviceSlidersGroups = service.pricingModel.slidersGroups;

    const selectedServicesSliders = selectedSliders.filter(
      (slider) => slider.selectedAmount > 0
    );

    updatedPricingModel.slidersGroups = serviceSlidersGroups.map((group) => {
      const sliders = group.sliders.map((slider) => {
        const selectedAmount =
          selectedServicesSliders.find(
            (selectedSlider) =>
              selectedSlider.sliderId === slider._id.toString()
          )?.selectedAmount || 0;

        if (selectedAmount > 0) {
          parsedSliders += 1;
        }

        return {
          ...slider,
          selectedAmount,
        };
      });

      return {
        ...group,
        sliders,
      };
    });
  }

  if (parsedSliders !== selectedSlidersAmount) {
    throw new Error("Not all sliders were parsed");
  }

  if (parsedOptions !== selectedOptionsAmount) {
    throw new Error("Not all options were parsed");
  }

  const subscriptionServiceBody = {
    name: service.name,
    pricingModel: updatedPricingModel,
    serviceId,
    companyId,
  };

  const newSubscriptionService = new SubscriptionService(
    subscriptionServiceBody
  );
  await newSubscriptionService.save();

  return newSubscriptionService;
};
