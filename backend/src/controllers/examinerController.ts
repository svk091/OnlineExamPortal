import { hashString, verifyHash } from '../utils/hashing';
import prisma from '../db/prisma';
import { z } from "zod";
import jwt from 'jsonwebtoken';
import axios from 'axios';

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
})

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const JWT_SECRET = process.env.JWT_SECRET || "";

const signup = async (req: any, res: any) => {
  const validation = signupSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: validation.error.issues
    })
  }
  const { name, email, password } = validation.data;

  try {
    const hashedPassword = await hashString(password);
    const examiner = await prisma.examiner.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true
      }
    })
    const token = jwt.sign({ examinerId: examiner.id }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).json({
      msg: "Examiner Registerd",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error creating examiner"
    })
  }
}

const signin = async (req: any, res: any) => {
  const validation = signinSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: validation.error
    })
  }
  const { email, password } = validation.data;
  try {
    const examiner = await prisma.examiner.findFirst({
      where: {
        email
      }
    })
    if (!examiner) {
      return res.status(404).json({
        error: "Email not exist"
      })
    }
    if (!await verifyHash(password, examiner?.password || "")) {
      return res.status(401).json({
        error: "Incorrect Password"
      })
    }
    const token = await jwt.sign({ examinerId: examiner?.id }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).json({
      msg: "Examiner Verified",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error signin examiner"
    })
  }
}

const createExamSchema = z.object({
  category: z.string(),
  categoryId: z.number(),
  difficulty: z.string(),
  numOfQns: z.number(),
  timeLimit: z.number()
})
const createExam = async (req: any, res: any) => {
  const body = req.body;
  const validation = createExamSchema.safeParse(body);
  if (!validation.success) {
    return res.status(400).json({
      error: validation.error.issues
    })
  }
  const { category, categoryId, difficulty, numOfQns, timeLimit } = validation.data;
  try {
    const response = await axios.get(`https://opentdb.com/api.php?amount=${numOfQns}&category=${categoryId}&difficulty=${difficulty}&type=multiple`);

    const questions = response.data.results;

    const exam = await prisma.exam.create({
      data: {
        category,
        difficulty,
        numOfQns,
        timeLimit,
        examinerId: req.examinerId,
        studentScores: {
          create: []
        }
      }
    })
    for (const question of questions) {
      await prisma.question.create({
        data: {
          examId: exam.id,
          question: question.question,
          correctAnswer: question.correct_answer,
          incorrectAnswers: JSON.stringify(question.incorrect_answers),
        }
      })
    }
    const examLink = `${req.protocol}://${req.get('host')}/exam/${exam.id}`;
    return res.status(200).json({
      msg: "Exam created success",
      examLink: examLink
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error creating exam"
    })
  }
}

const viewExamResults = async (req: any, res: any) => {
  const { examId } = req.params;

  try {
    const exam = await prisma.exam.findFirst({
      where: {
        id: examId
      },
      include: {
        studentScores: true
      }
    })
    return res.status(200).json({
      msg: "Results fetched successfully",
      exam
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error fetching exam"
    })
  }
}

const viewExams = async (req: any, res: any) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        examinerId: req.examinerId
      }
    });
    return res.status(200).json({
      exams
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error fetching exam"
    })
  }
}

export {
  signup,
  signin,
  createExam,
  viewExamResults,
  viewExams
}