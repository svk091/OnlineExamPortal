import express from 'express';
import { signup, signin, createExam, viewExamResults, viewExams } from "../controllers/examinerController";
import authMiddleware from '../middlewares/authMiddleware';

const examinerRouter = express.Router();

examinerRouter.post("/signup", signup);

examinerRouter.post("/signin", signin);

examinerRouter.use(authMiddleware);

examinerRouter.post("/create-exam", createExam);

examinerRouter.get("/dashboard", viewExams);

examinerRouter.get("/exam-results/:examId", viewExamResults);

export default examinerRouter;