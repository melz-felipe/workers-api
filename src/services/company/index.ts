import { Company, ICompany } from "@models/company";

export const getCompanyById = async (companyId: string) => {
  const company = await Company.findById(companyId);

  return company;
};

export const getCompanyBySubdomain = async (subdomain: string) => {
  const company = await Company.findOne({ subdomain });

  return company;
};

export const getAllCompanies = async (page: number, limit: number) => {
  const companies = await Company.find();
  const total = companies.length;
  const totalPages = Math.ceil(total / limit);
  const offset = limit * (page - 1);

  const paginatedCompanies = await Company.find().skip(offset).limit(limit);

  return {
    companies: paginatedCompanies,
    total,
    totalPages,
  };
};

export const createCompany = async (company: ICompany) => {
  const newCompany = new Company(company);
  await newCompany.save();

  return newCompany;
};
