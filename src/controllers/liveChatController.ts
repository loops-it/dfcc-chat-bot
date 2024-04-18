import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ChatHeader from '../../models/ChatHeader';
import LiveChat from '../../models/LiveChat';
import AgentLanguages from '../../models/AgentLanguages';
import ChatTimer from '../../models/ChatTimer';
interface UserDecodedToken extends JwtPayload {
  id: string;
  
}

export const liveChat = async (req: Request, res: Response, next: NextFunction) => {
const {chatId} = req.body
try {
    const chat_header_result  = await ChatHeader.findOne({
        where: {
            "message_id" : chatId
        },
      });
    const chat_body_result = await LiveChat.findOne({
        where: {
            message_id: chatId,
            sent_by: 'agent',
            sent_to_user: 'no',
        },
        order: [['id', 'DESC']],
    });
    if(){

    }
    else{
        
    }
}
catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({ error: "An error occurred." });
}
};


