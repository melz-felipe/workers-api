import { Address, IAddress } from "@models/address";

import { getUserById } from "@services/user";

export const createAddress = async (address: IAddress, companyId: string) => {
  const user = await getUserById(address.userId as unknown as string);
  if (!user) {
    throw new Error("User not found");
  }

  return await Address.create({...address, companyId});
};

export const getAddressById = async (id: string) => {
  return await Address.findById(id);
};

export const getAddressesByUserId = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await Address.find({
    userId,
  });
};
