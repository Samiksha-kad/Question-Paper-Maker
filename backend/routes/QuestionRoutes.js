import express from 'express';
import { question, getQuestionPaper, QuestionDelete, UpdateQuestion } from '../controller/QuestionController.js';
const questionRouter = express.Router();

questionRouter.post("/questionAddService", question)
questionRouter.get("/getQuestionService", getQuestionPaper)
questionRouter.post("/questionDeleteService", QuestionDelete)
questionRouter.post("/updateQuestionService", UpdateQuestion)

export default questionRouter

