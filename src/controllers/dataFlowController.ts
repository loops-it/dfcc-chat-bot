import { Request, Response } from 'express';
const bodyParser = require('body-parser');
const pdfParse = require('pdf-parse');
import "dotenv/config";
import Node from '../../models/Node';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserDecodedToken extends JwtPayload {
  id: string;
  // Add other properties if needed
}
export const insertNode = async (req: Request, res: Response, next: Function) => {
   console.log("insertNode",req.body);
   try {
    await Node.create({
    node_id: req.body.id,
    dragging: req.body.dragging,
    height: req.body.height,
    position: req.body.position,
    positionAbsolute: req.body.positionAbsolute,
    selected: req.body.selected,
    type: req.body.type,
    width: req.body.width,
    extent: req.body.extent,
    parentId: req.body.parentId,
    });
    res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
  };
  

export const insertEdge = async (req: Request, res: Response, next: Function) => {
    console.log("insertEdge",req.body);
    res.json({ status: "success"}) 
};
  
  