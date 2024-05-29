import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Question from '../../models/Question';


export const addQuestion = async (req: Request, res: Response) => {
    const {question, intent, language} = req.body;
    //console.log(req.body);
    try {
        await Question.create(
              { 
              question: question,
              intent: intent,
              language: language,
              },
        );
         
      return res.json({status:"success", message:"Question Added"})
      
      } catch (error) {
        return res.json({status:"failed", message:`${error}`})
      }
};