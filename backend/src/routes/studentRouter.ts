import express from 'express';
import { submitHandler } from '../controllers/studentController';

const studentRouter = express.Router();

studentRouter.post("/submit-answers/:examId", submitHandler);

export default studentRouter;