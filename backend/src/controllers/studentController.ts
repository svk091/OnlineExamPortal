import prisma from '../db/prisma';
import { z } from "zod";

const submitHandlerSchema = z.object({
  studentName: z.string(),
  studentEmail: z.string().email(),
  studentAnswers: z.array(z.object({
    questionId: z.string().uuid(),
    answer: z.string()
  }))
})
const submitHandler = async (req: any, res: any) => {
  const body = req.body;
  const validation = submitHandlerSchema.safeParse(body);
  if (!validation.success) {
    return res.status(400).json({
      error: validation.error
    })
  }
  const { studentName, studentEmail, studentAnswers } = validation.data;
  const examId = req.params.examId;
  try {
    const exam = await prisma.exam.findFirst({
      where: {
        id: examId
      },
      include: {
        Question: true
      }
    })
    if (!exam) {
      return res.status(404).json({
        error: "Exam not found"
      })
    }

    let score = 0;
    let correctAnswers = 0;
    for (const question of exam.Question) {
      const answer = studentAnswers.find((answer) => answer.questionId === question.id);
      if (answer && answer.answer === question.correctAnswer) {
        score += 1;
        correctAnswers++;
      }
    }
    ;
    await prisma.studentScore.create({
      data: {
        examId,
        studentName,
        studentEmail,
        studentAnswers: studentAnswers.map((answer) => JSON.stringify(answer)),
        score,
        correctAnswers
      }
    })
    return res.status(200).json({
      msg: "Answers submitted successfully",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error submitting answers"
    })
  }
}

export {
  submitHandler
}