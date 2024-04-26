import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Sector from '../../models/Sector';


export const sectorAdd = async (req: Request, res: Response) => {
    const {sector_name, email} = req.body;
    console.log(req.body);
    try {
        await Sector.create(
              { 
              email: email,
              sector_name: sector_name,
              },
        );
         
      return res.json({status:"success", message:"Sector Added"})
      
      } catch (error) {
        return res.json({status:"failed", message:`${error}`})
      }
};

