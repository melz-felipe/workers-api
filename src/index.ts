import express from "express";
import { json } from "body-parser";
import * as dotenv from "dotenv";

dotenv.config();

import { companyRouter } from "@routes/company";

const app = express();

app.use(json());
app.use(companyRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
