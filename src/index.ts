import express from "express";
import { json } from "body-parser";
import * as dotenv from "dotenv";

dotenv.config();

import { companyRouter } from "@routes/company";
import { userRouter } from "@routes/user";
import { serviceRouter } from "@routes/service";
import { subscriptionRouter } from "@routes/subscription";

const app = express();

app.use(json());

app.use(companyRouter);
app.use(userRouter);
app.use(serviceRouter);
app.use(subscriptionRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
