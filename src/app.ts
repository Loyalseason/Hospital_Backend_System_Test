import express from "express";
import { userRouter, authRouter, noteRouter, patientRouter, doctorRouter } from "./routes/index";
import globalErrorHandler from "./middlewares/errorMiddleware";
import cookieParser from "cookie-parser";
export const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", noteRouter);
app.use("/", doctorRouter);
app.use("/", patientRouter);

app.use(globalErrorHandler);

export default app;
