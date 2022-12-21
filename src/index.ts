import express from "express";
import { json } from "body-parser";
import * as dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

import { companyRouter } from "@routes/company";
import { userRouter } from "@routes/user";
import { serviceRouter } from "@routes/service";
import { subscriptionRouter } from "@routes/subscription";
import { addressRouter } from "@routes/address";
import { appointmentRouter } from "@routes/appointment";

const app = express();

app.use(cors());

app.use(json());

app.use(companyRouter);
app.use(userRouter);
app.use(serviceRouter);
app.use(subscriptionRouter);
app.use(addressRouter);
app.use(appointmentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
