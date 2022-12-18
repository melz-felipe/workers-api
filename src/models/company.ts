import mongoose from "@database/instance";

interface ICompany {
  name: string;
}

const companySchema = new mongoose.Schema<ICompany>({
  name: { type: String, required: true },
});

const Company = mongoose.model("Company", companySchema);

export { Company, ICompany };
