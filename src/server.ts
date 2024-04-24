// src/server.ts
import express, { Request, Response } from 'express';
import path from 'path';
import indexRouter from './routes/index';
import { chatResponse } from './controllers/chatController';
import { liveChat } from './controllers/liveChatController';
import "dotenv/config";
import bodyParser from 'body-parser';
import { viewDocuments } from './controllers/viewDocumentsController';
import { uploadDocuments, handleFileUpload } from './controllers/uploadDocumentsController';
import { editDocument } from './controllers/editDocumentController';
import { updateDocuments, handleFileUploadUpdate } from './controllers/updateDocumentController';
import { deleteDocument } from './controllers/deleteDocumentController';
import { login, agent } from './controllers/loginController';
import { adminLogged } from './controllers/adminLogged';
import { agentLogged } from './controllers/agentLogged';
import { liveChatsOnload,refreshLiveChats,replyLiveChats,sendReplyLiveChats,closeLiveChats,refreshLiveChatInner } from './controllers/liveChats';
import session from "express-session";
import flash from "express-flash";
import cookieParser from 'cookie-parser';
import ChatHeader from '../models/ChatHeader';
import AgentLanguages from '../models/AgentLanguages';
import { adminAccountCreate,adminUpdate,matchPassword,adminUpdateWithPassword } from './controllers/adminAccount';
import { agentCreateAccount,agentUpdateAccount,agentUpdateWithPassword } from './controllers/AgentAccount';
import { botChatsOnload,botChatsGetMessages,botChatsRefresh,botChatsRefreshMessage} from './controllers/botChats';
import { LiveChatHistoryOnload,LiveChatHistoryMessages,LiveChatHistoryRefresh,LiveChatHistoryRefreshMessages} from './controllers/LiveChatHistory';
import Admin from '../models/Admin';
import User from '../models/User';
import BotChats from '../models/BotChats';
import Agent from '../models/Agent';
import ChatTimer from '../models/ChatTimer';
import { loadLiveChatHistory } from './controllers/loadLiveChatHistory';
import { Op } from 'sequelize';
import { getFlowPage } from './controllers/flowController';
const app = express();
app.use(cookieParser());
// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

declare module 'express-session' {
    interface SessionData {
      user: any; // Adjust this type according to your User model
    }
  }
// public folder
app.use(express.static('public'));
app.use(session({
    secret: 'dfcc',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
// Routes
app.use('/', indexRouter);

app.post('/api/chat-response', chatResponse);
app.post('/live-chat-agent', liveChat);
app.get('/view-documents', adminLogged, viewDocuments);
app.get('/view-flow-page', getFlowPage);
app.get('/upload-documents', adminLogged, (req: Request, res: Response) => {
    res.render('upload-documents');
});
app.get('/edit-document', adminLogged, editDocument);
app.post('/upload-documents', handleFileUpload, uploadDocuments);

app.post('/update-document', handleFileUploadUpdate, updateDocuments);

app.get('/delete-document',adminLogged, deleteDocument);

app.get('/login', (req: Request, res: Response) => {
    const successMessage = req.flash('success')[0];
    const errorMessage = req.flash('error')[0];
    res.render('login', {successMessage: successMessage,errorMessage: errorMessage});
});
app.post('/login', login);

app.get('/admin-dashboard', adminLogged, (req: Request, res: Response) => {
    res.render('admin-dashboard');
});
app.get('/add-admin', adminLogged, (req: Request, res: Response) => {
    res.render('add-admin');
});
app.post('/admin-add', adminAccountCreate);
app.get('/manage-admins', adminLogged, async (req: Request, res: Response) => {
    const admins  = await Admin.findAll({});
    res.render('manage-admins', {admins: admins});
});
app.get('/deactivate-admin/:id', adminLogged, async (req: Request, res: Response) => {
    let user_id = req.params.id;
    await Admin.update(
        { status: "inactive" },
        { where: { user_id: user_id } }
      );
    await User.update(
        { status: "inactive" },
        { where: { id: user_id } }
      );
    res.redirect("/manage-admins");
});
app.get('/activate-admin/:id', adminLogged, async (req: Request, res: Response) => {
    let user_id = req.params.id;
    await Admin.update(
        { status: "active" },
        { where: { user_id: user_id } }
      );
    await User.update(
        { status: "active" },
        { where: { id: user_id } }
      );
    res.redirect("/manage-admins");
});
app.get('/edit-admin', adminLogged, async (req: Request, res: Response) => {
    const user_id = req.query.id;

    const admin_details  = await Admin.findOne({
        where: {
            user_id : user_id,
        },
    });
    const login_details  = await User.findOne({
        where: {
            id : user_id,
        },
    });
    res.render('edit-admin', {admin_details: admin_details,login_details: login_details});
});
app.post('/admin-update', adminLogged, adminUpdate);
app.post('/user-check-current-password', matchPassword);
app.post('/admin-update-with-password', adminUpdateWithPassword);
app.get('/agent', (req: Request, res: Response) => {
    const successMessage = req.flash('success')[0];
    const errorMessage = req.flash('error')[0];
    res.render('agent', {successMessage: successMessage,errorMessage: errorMessage});
});
app.get('/conversation-history', adminLogged, async (req: Request, res: Response) => {
    const chats = await BotChats.findAll({
        attributes: ['message_id'],
        group: ['message_id']
    });
    res.render('conversation-history', {chats: chats});
});
app.post('/bot-chats-onload', adminLogged, botChatsOnload);
app.post('/get-chat-messages', adminLogged, botChatsGetMessages);
app.post('/refresh-chats', adminLogged, botChatsRefresh);
app.post('/refresh-selected-chat', adminLogged, botChatsRefreshMessage);
app.get('/live-chat-history', adminLogged, async (req: Request, res: Response) => {
    res.render('live-chat-history');
});
app.post('/load-live-chat-history', adminLogged, loadLiveChatHistory);
app.get('/view-agent-chats', adminLogged, async (req: Request, res: Response) => {
    const agent_id = req.query.id;

    const agent = await Agent.findAll({
        where: {
          user_id: agent_id
        }
      });
      const chat_count = await ChatHeader.count({
        where: {
          agent: agent_id
        }
      });
      const timer = await ChatTimer.findAll({
        where: {
          agent: agent_id
        }
      });
      const chats = await ChatHeader.findAll({
        where: {
          agent: agent_id
        }
      });
    res.render('view-agent-chats', { agent: agent, chat_count: chat_count, timer: timer, chats: chats });
});
app.post('/onload-live-chat-history-chats', LiveChatHistoryOnload);
app.post('/get-agent-live-chat-messages', LiveChatHistoryMessages);
app.post('/refresh-live-agent-chats', LiveChatHistoryRefresh);
app.post('/refresh-selected-agent-live-chat', LiveChatHistoryRefreshMessages);
app.get('/view-agent-feedbacks', adminLogged, async (req: Request, res: Response) => {
    const agent_id = req.query.id;

    const agent = await Agent.findAll({
        where: {
          user_id: agent_id
        }
      });
      const chats = await ChatHeader.findAll({
        where: {
          agent: agent_id,
          feedback: {
            [Op.not]: null
        }
        }
      });
    res.render('view-agent-feedbacks', { agent: agent, chats: chats });
});
app.get('/add-agent',adminLogged, (req: Request, res: Response) => {
    const successMessage = req.flash('success')[0];
    const errorMessage = req.flash('error')[0];
    res.render('add-agent', {successMessage: successMessage,errorMessage: errorMessage});
});
app.post('/agent-add', agentCreateAccount);
app.get('/manage-agents',adminLogged, async (req: Request, res: Response) => {
  app.get('/deactivate-agent/:id', adminLogged, async (req: Request, res: Response) => {
    let user_id = req.params.id;
    await Agent.update(
        { status: "inactive" },
        { where: { user_id: user_id } }
      );
    await User.update(
        { status: "inactive" },
        { where: { id: user_id } }
      );
    res.redirect("/manage-agents");
});
app.get('/activate-agent/:id', adminLogged, async (req: Request, res: Response) => {
    let user_id = req.params.id;
    await Agent.update(
        { status: "active" },
        { where: { user_id: user_id } }
      );
    await User.update(
        { status: "active" },
        { where: { id: user_id } }
      );
    res.redirect("/manage-agents");
});
app.get('/edit-agent', adminLogged, async (req: Request, res: Response) => {
  const user_id = req.query.id;

  const agent_details  = await Agent.findOne({
      where: {
          user_id : user_id,
      },
  });
  const login_details  = await User.findOne({
      where: {
          id : user_id,
      },
  });
  const languages  = await AgentLanguages.findAll({
    where: {
      user_id : user_id,
    },
});
  res.render('edit-agent', {agent_details: agent_details,login_details: login_details,languages: languages});
});
  const agents = await Agent.findAll({});
  res.render('manage-agents', {agents: agents});
});

app.post('/agent-update', agentUpdateAccount);
app.post('/agent-update-with-password', agentUpdateWithPassword);
app.post('/agent', agent);
app.get('/agent-dashboard', agentLogged, (req: Request, res: Response) => {
    res.render('agent-dashboard');
});
app.get('/live-chats', agentLogged, async (req, res) => {

    //console.log(res.locals.agent_login_details.dataValues);
    const chats  = await ChatHeader.findAll({
        where: {
            "agent" : "unassigned",
            "status" : "live",
        },
      });
    const languages  = await AgentLanguages.findAll({
        where: {
            "user_id" : res.locals.agent_login_details.dataValues.id,
        },
    });
    res.render('live-chats', {chats: chats,languages: languages});
});

app.post("/live-chats-onload", liveChatsOnload)
app.post("/refresh-live-chats", refreshLiveChats)
app.post("/reply-to-live-chat",replyLiveChats)
app.post("/agent-reply-live-chat",sendReplyLiveChats)
app.post("/close-live-chat",closeLiveChats)
app.post("/refresh-live-chat-inner",refreshLiveChatInner)



app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "dfcc123";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log(req.query);
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log("message body",body);
  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      // Your business logic goes here
      handleMessage(webhookEvent);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const handleMessage = (event: any) => {
  const senderId = event.sender.id;
  const message = event.message;

  if (message && message.text) {
    const response = {
      text: `You sent the message: "${message.text}". Now, how can I help you?`,
    };
    sendMessage(senderId, response);
  }
};

const sendMessage = async (recipientId: string, message: any) => {
  const requestBody = {
    recipient: {
      id: recipientId,
    },
    message: message,
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=EAAF348C6zRwBOygEAVOQDjd3QK5YhIHbGGmdDDca0HDaDEbS0sdlEqPycuP7satY9GPf6QPhYTVdUawRe7XTZBAQkaAT6rPrqNVICUNjcYxuZApRs6YjzUYpqxzUtbW1lUSyN2z4VhLhMAeMmiCzYtawEStMYtZCNIZBcOeEIB0glhiTRkT0qaXuB9I0m3Dd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Unable to send message:', error);
  }
};


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
