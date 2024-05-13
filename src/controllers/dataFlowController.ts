import { Request, Response } from 'express';
const bodyParser = require('body-parser');
const pdfParse = require('pdf-parse');
import "dotenv/config";
import Node from '../../models/Node';
import Edge from '../../models/Edge';
import FlowTextOnly from '../../models/FlowTextOnly';
import FlowTextBox from '../../models/FlowTextBox';
import FlowButtonData from '../../models/FlowButtonData';
import FlowCardData from '../../models/FlowCardData';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserDecodedToken extends JwtPayload {
  id: string;
  // Add other properties if needed
}
export const insertNode = async (req: Request, res: Response, next: Function) => {
   //console.log("insertNode",req.body);
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
    //console.log("insertEdge",req.body);
    try {
        await Edge.create({
        edge_id: req.body.id,
        source: req.body.source,
        sourceHandle: req.body.sourceHandle,
        target: req.body.target,
        targetHandle: req.body.targetHandle,
        type: req.body.type
        });
        res.json({ status: "success"}) 
        } catch (error) {
        console.error('Error inserting data:', error);
    }
};

export const updateNode = async (req: Request, res: Response, next: Function) => {
    //console.log("updateNode",req.body);
    try {
    await Node.update(
        { position: req.body.position },
        { where: { node_id: req.body.id } }
    );
     res.json({ status: "success"}) 
     } catch (error) {
     console.error('Error inserting data:', error);
     }
};
  
export const updateEdge = async (req: Request, res: Response, next: Function) => {
    //console.log("updateEdge",req.body);
    try {
    await Edge.update(
        { 
        source: req.body.source,
        sourceHandle: req.body.sourceHandle,
        target: req.body.target,
        targetHandle: req.body.targetHandle,
        type: req.body.type 
        },
        { where: { edge_id: req.body.id } }
    );
     res.json({ status: "success"}) 
     } catch (error) {
     console.error('Error inserting data:', error);
     }
};

export const deleteNode = async (req: Request, res: Response, next: Function) => {
    //console.log("deleteNode",req.body);
    try {
    if(req.body.type == "start"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
    
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
    }
    if(req.body.type == "end"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
    
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
    }
    if(req.body.type == "textOnly"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
        
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
        await FlowTextOnly.destroy({
            where: {
                node_id: req.body.id
            }
        });
    }
    if(req.body.type == "textinput"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
        
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
        await FlowTextBox.destroy({
            where: {
                node_id: req.body.id
            }
        });
    }
    if(req.body.type == "button"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
        
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
        await FlowButtonData.destroy({
            where: {
                node_id: req.body.id
            }
        });
    }
    if(req.body.type == "cardGroup"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Node.destroy({
            where: {
                parentId: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
        
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
        await FlowCardData.destroy({
            where: {
                node_id: req.body.id
            }
        });
    }
    if(req.body.type == "buttonGroup"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        await Node.destroy({
            where: {
                parentId: req.body.id
            }
        });
        await Edge.destroy({
            where: {
                source: req.body.id
            }
        });
        
        await Edge.destroy({
            where: {
                target: req.body.id
            }
        });
        await FlowCardData.destroy({
            where: {
                node_id: req.body.id
            }
        });
    }


     res.json({ status: "success"}) 
     } catch (error) {
     console.error('Error inserting data:', error);
     }
};

export const deleteEdge = async (req: Request, res: Response, next: Function) => {
    //console.log("deleteNode",req.body);
    try {
    await Edge.destroy({
        where: {
            edge_id: req.body.id
        }
    });
     res.json({ status: "success"}) 
     } catch (error) {
     console.error('Error inserting data:', error);
     }
};

export const retrieveData = async (req: Request, res: Response, next: Function) => {
    //console.log("deleteNode",req.body);
    try {
        const nodes = await Node.findAll({});
        const edges = await Edge.findAll({});
        const textOnly = await FlowTextOnly.findAll({});
        const textBox = await FlowTextBox.findAll({});
        const buttonData = await FlowButtonData.findAll({});
        const cardData = await FlowCardData.findAll({});

     res.json({ status: "success", nodes: nodes, edges: edges, textOnly: textOnly, textBox: textBox, buttonData: buttonData, cardData: cardData}) 

     } catch (error) {
     console.error('Error inserting data:', error);
     }
};


export const textOnlyData = async (req: Request, res: Response, next: Function) => {
    //console.log("insertEdge",req.body);
    try {
        const data_exist = await FlowTextOnly.findOne({
            where: {
              "node_id" : req.body.id,
            },
          });
        if (data_exist) {
            await FlowTextOnly.update(
                { 
                text: req.body.text,
                },
                { where: { node_id: req.body.id } }
            );
        }
        else{
            await FlowTextOnly.create({
                node_id: req.body.id,
                text: req.body.text,
            });
        }
        
        res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
};
export const textBoxData = async (req: Request, res: Response, next: Function) => {
    //console.log("insertEdge",req.body);
    try {
        const data_exist = await FlowTextBox.findOne({
            where: {
              "node_id" : req.body.id,
            },
          });
        if (data_exist) {
            await FlowTextBox.update(
                { 
                title: req.body.title,
                description: req.body.description,
                },
                { where: { node_id: req.body.id } }
            );
        }
        else{
            await FlowTextBox.create({
                node_id: req.body.id,
                title: req.body.title,
                description: req.body.description,
            });
        }
        
        res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
};

export const ButtonData = async (req: Request, res: Response, next: Function) => {
    //console.log("insertEdge",req.body);
    try {
        const data_exist = await FlowButtonData.findOne({
            where: {
              "node_id" : req.body.id,
            },
          });
        if (data_exist) {
            await FlowButtonData.update(
                { 
                text: req.body.text,
                link: req.body.link,
                },
                { where: { node_id: req.body.id } }
            );
        }
        else{
            await FlowButtonData.create({
                node_id: req.body.id,
                text: req.body.text,
                link: req.body.link,
            });
        }
        
        res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
};

export const CardData = async (req: Request, res: Response, next: Function) => {
    console.log("CardData",req.body);
    try {
        const data_exist = await FlowCardData.findOne({
            where: {
              "node_id" : req.body.id,
            },
          });
        if (data_exist) {
            await FlowCardData.update(
                { 
                title: req.body.title,
                description: req.body.description,
                image: "card-test-image.png",
                },
                { where: { node_id: req.body.id } }
            );
        }
        else{
            await FlowCardData.create({
                node_id: req.body.id,
                title: req.body.title,
                description: req.body.description,
                image: "card-test-image.png",
            });
        }
        
        res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
};
