import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone'
import axios from 'axios';
import "dotenv/config";
import { Request as ExpressRequest } from 'express';
import File from '../../models/File';
import BotChats from '../../models/BotChats';
import {Translate} from '@google-cloud/translate/build/src/v2';
import { Request, Response } from 'express';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
if (!process.env.PINECONE_API_KEY || typeof process.env.PINECONE_API_KEY !== 'string') {
    throw new Error('Pinecone API key is not defined or is not a string.');
}
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

interface RequestWithChatId extends ExpressRequest {
    userChatId?: string;
}
interface ChatEntry {
    role: string;
    content: string;
}

const translate = new Translate({ key: process.env.GOOGLE_APPLICATION_CREDENTIALS }); 

export const facebookChat = async (req: Request, res: Response) => {

    
    const index = pc.index("dfccchatbot");
    const namespace = index.namespace('pinecone-gpt-test')
  
    const body = req.body;

    try {
        if (body.object === 'page') {
            body.entry.forEach((entry: any) => {
            const message_body = entry.messaging[0];
            //console.log("messages",entry.messaging);
            handleMessage(message_body);
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
                res.sendStatus(404);
        }
        

    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).json({ error: "An error occurred." });
    }

};

const handleMessage = (message_body: any) => {
    console.log("handleMessage body",message_body)
    const senderId = message_body.sender.id;
    const message = message_body.message.text;



    const reply = `You sent the message: "${message}". Now, how can I help you?`;
  
   sendMessage(senderId, reply);
  
  };

const sendMessage = async (recipientId: string, reply: any) => {

    // console.log("recipientId",recipientId)
    // console.log("reply",reply)
  
    const data = {
      recipient: {
        id: recipientId,
      },
      messaging_type: "RESPONSE",
      message: {
        text: reply,
      },
    };
  
    try {
      const response = await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=EAAF348C6zRwBOygEAVOQDjd3QK5YhIHbGGmdDDca0HDaDEbS0sdlEqPycuP7satY9GPf6QPhYTVdUawRe7XTZBAQkaAT6rPrqNVICUNjcYxuZApRs6YjzUYpqxzUtbW1lUSyN2z4VhLhMAeMmiCzYtawEStMYtZCNIZBcOeEIB0glhiTRkT0qaXuB9I0m3Dd`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Unable to send message:', error);
    }
  };








































