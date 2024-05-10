import { Request, Response } from 'express';
const bodyParser = require('body-parser');
const pdfParse = require('pdf-parse');
import "dotenv/config";
import Node from '../../models/Node';
import Edge from '../../models/Edge';
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
    if(req.body.type == "cardGroup" || req.body.type == "buttonGroup"){
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
    }
    else{
    await Node.destroy({
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

     res.json({ status: "success", nodes: nodes, edges: edges}) 

     } catch (error) {
     console.error('Error inserting data:', error);
     }
};
  