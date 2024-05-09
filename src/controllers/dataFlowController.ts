import { Request, Response } from 'express';
const bodyParser = require('body-parser');
const pdfParse = require('pdf-parse');
import multer from 'multer';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone'
import "dotenv/config";
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserDecodedToken extends JwtPayload {
  id: string;
  // Add other properties if needed
}
export const insertNode = async (req: Request, res: Response, next: Function) => {
   console.log("insertNode",req.body);
   res.json({ status: "success"}) 
  };
  

export const insertEdge = async (req: Request, res: Response, next: Function) => {
    console.log("insertEdge",req.body);
    res.json({ status: "success"}) 
};
  
  