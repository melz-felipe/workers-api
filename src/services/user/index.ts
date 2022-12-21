import { User, IUser } from "@models/user";

interface ICreateUser extends Omit<IUser, "companyId" | "role"> {}

export const createUser = async (
  user: ICreateUser,
  role: IUser["role"],
  companyId: IUser["companyId"]
) => {
  const userBody = { ...user, role, companyId };

  const newUser = new User(userBody);
  await newUser.save();

  return newUser;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({
    email,
  });

  return user;
};

export const getAllUsers = async (
  page: number,
  limit: number,
  companyId?: IUser["companyId"]
) => {
  const companyIdParam = companyId ? { companyId } : {};

  const users = await User.find(companyIdParam);
  const total = users.length;
  const totalPages = Math.ceil(total / limit);
  const offset = limit * (page - 1);

  const paginatedUsers = await User.find(companyIdParam)
    .skip(offset)
    .limit(limit);

  return {
    users: paginatedUsers,
    total,
    totalPages,
  };
};

export const getAllWorkersForCompanyId = async (companyId: string) => {
  const users = await User.find({ role: "worker", companyId });
  return users;
};

export const getAllCustomersForCompanyId = async (companyId: string) => {
  const users = await User.find({ role: "customer", companyId });
  return users;
};
