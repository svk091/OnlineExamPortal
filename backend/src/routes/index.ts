import express from "express"
import examinerRouter from "./examinerRouter"
import studentRouter from "./studentRouter";
const rootRouter = express.Router()

rootRouter.use("/examiner", examinerRouter);
rootRouter.use("/student", studentRouter);

export default rootRouter;