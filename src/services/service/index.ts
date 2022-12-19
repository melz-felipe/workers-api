import { Service, IService } from "@models/service";

interface ICreateService extends Omit<IService, "companyId"> {}

export const createService = async (
  service: ICreateService,
  companyId: IService["companyId"]
) => {
  const serviceBody = { ...service, companyId };

  const newService = new Service(serviceBody);
  await newService.save();

  return newService;
};

export const getServiceById = async (serviceId: string) => {
  const service = await Service.findById(serviceId);

  return service;
};

export const getAllServices = async (
  page: number,
  limit: number,
  filterParams?: Partial<IService>
) => {
  const servicesFilterParams = filterParams ?? {};

  const services = await Service.find(servicesFilterParams);
  const total = services.length;
  const totalPages = Math.ceil(total / limit);
  const offset = limit * (page - 1);

  const paginatedServices = await Service.find(servicesFilterParams)
    .skip(offset)
    .limit(limit);

  return {
    services: paginatedServices,
    total,
    totalPages,
  };
};
