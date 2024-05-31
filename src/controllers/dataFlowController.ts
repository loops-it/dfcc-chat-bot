import { Request, Response, NextFunction } from 'express';
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
import Question from '../../models/Question';

interface intentData {
    type: string;
    node_data: any;
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
    language: req.body.language,
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
        const childs = await Node.findAll({
            where: {
              "parentId" : req.body.id,
            },
        });
        for (var c = 0; c < childs.length; c++){
            if(childs[c].type == 'cardHeader'){
                await FlowCardData.destroy({
                    where: {
                        node_id: childs[c].node_id
                    }
                });
            }
            else{
                await FlowButtonData.destroy({
                    where: {
                        node_id: childs[c].node_id
                    }
                });
            }
        }
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
        
    }
    if(req.body.type == "buttonGroup"){
        await Node.destroy({
            where: {
                node_id: req.body.id
            }
        });
        const child_buttons = await Node.findAll({
            where: {
              "parentId" : req.body.id,
            },
        });
        for (var c = 0; c < child_buttons.length; c++){
            await FlowButtonData.destroy({
                where: {
                    node_id: child_buttons[c].node_id
                }
            });
        }
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
        
    }

    if(req.body.type == "cardStyleOne"){
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
        const nodes = await Node.findAll({where: {
            language: req.body.language
        }});
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
        await Node.update(
            { intent: req.body.intent },
            { where: { node_id: req.body.id } }
        );
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
        await Node.update(
            { intent: req.body.intent },
            { where: { node_id: req.body.id } }
        );
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
export const ButtonGroup = async (req: Request, res: Response, next: Function) => {
    //console.log("insertEdge",req.body);
    try {
        await Node.update(
            { intent: req.body.intent },
            { where: { node_id: req.body.id } }
        );
        res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
};

export const CardData = async (req: Request, res: Response, next: Function) => {
    console.log("CARD REQ DATA",req.body);
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
        if(req.body.type=="group"){
            await Node.update(
                { intent: req.body.intent },
                { where: { node_id: req.body.parentID } }
            );
        }
        else{
            await Node.update(
                { intent: req.body.intent },
                { where: { node_id: req.body.id } }
            );
        }
        res.json({ status: "success"}) 
    } catch (error) {
    console.error('Error inserting data:', error);
    }
};
export const getIntentData = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const question_details = await Question.findOne({
            where: {
                id: req.body.intent,
            },
        });
        let intent = "";
        if(question_details){
            const node = await Node.findOne({
                where: {
                    id: question_details.intent,
                },
            });
            if(node){
            intent = node.intent;
            }
        }
        let intentData: any[] = [];
        const node_details = await Node.findAll({
            where: {
                intent: intent,
            },
        });

        for (const node of node_details) {
            const { type, node_id } = node;
            let nodeData;

            switch (type) {
                case 'textOnly':
                    nodeData = await FlowTextOnly.findOne({ where: { node_id } });
                    break;
                case 'textinput':
                    nodeData = await FlowTextBox.findOne({ where: { node_id } });
                    break;
                case 'cardStyleOne':
                    nodeData = await FlowCardData.findOne({ where: { node_id } });
                    break;
                case 'buttonGroup': {
                    const buttons = await Node.findAll({ where: { parentId: node_id } });
                    let buttonData = await Promise.all(buttons.map(async button => ({
                        button: await FlowButtonData.findOne({ where: { node_id: button.node_id } }),
                    })));
                    nodeData = buttonData;
                    break;
                }
                case 'cardGroup': {
                    const childs = await Node.findAll({ where: { parentId: node_id } });
                    let childData = await Promise.all(childs.map(async child => {
                        if (child.type === 'cardHeader') {
                            return { card: await FlowCardData.findOne({ where: { node_id: child.node_id } }) };
                        } else {
                            return { button: await FlowButtonData.findOne({ where: { node_id: child.node_id } }) };
                        }
                    }));
                    nodeData = childData;
                    break;
                } 
                default:
                    continue;
            }

            if (nodeData) {
                intentData.push({ type, node_data: nodeData });
            }
        }

        res.json({ status: "success", intentData });

    } catch (error) {
        console.error('Error retrieving intent data:', error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};


// export const getIntentData = async (req: Request, res: Response, next: Function) => {
//     // console.log("getProducts",req.body);
//      try {
//          let intentData: intentData[] = [];
//          let type: any;
//          let nodeData: any;
 
//          const node_details = await Node.findAll({
//              where: {
//                "intent" : req.body.intent,
//              },
//          });
//          for (var c = 0; c < node_details.length; c++){
             
//              type = node_details[c].type;
//              if(type == 'textOnly'){
//                  const node_data = await FlowTextOnly.findOne({
//                      where: {
//                          "node_id" : node_details[c].node_id,
//                      },
//                      });
//                  nodeData = node_data;
 
//                  intentData.push({type: type, node_data: nodeData});
//              }
//              if(type == 'textinput'){
//                  const node_data = await FlowTextBox.findOne({
//                      where: {
//                          "node_id" : node_details[c].node_id,
//                      },
//                      });
//                  nodeData = node_data;
 
//                  intentData.push({type: type, node_data: nodeData});
//              }
//              if(type == 'cardStyleOne'){
//                  const node_data = await FlowCardData.findOne({
//                      where: {
//                          "node_id" : node_details[c].node_id,
//                      },
//                      });
//                  nodeData = node_data;
//                  intentData.push({type: type, node_data: nodeData});
//              }
//              if (type == 'buttonGroup') {
//                  const buttons = await Node.findAll({
//                      where: {
//                          "parentId": node_details[c].node_id,
//                      },
//                  });
             
//                  let buttonData: any[] = [];
             
//                  for (var x = 0; x < buttons.length; x++) {
//                      const node_data = await FlowButtonData.findOne({
//                          where: {
//                              "node_id": buttons[x].node_id,
//                          },
//                      });
//                      if (node_data) { 
//                          buttonData.push({ button: node_data }); 
//                      }
//                  }
//                  intentData.push({ type: type, node_data: buttonData });
//              }
 
//              if (type == 'cardGroup') {
//                  const childs = await Node.findAll({
//                      where: {
//                          "parentId": node_details[c].node_id,
//                      },
//                  });
             
//                  let buttonData: any[] = [];
             
//                  for (var x = 0; x < childs.length; x++) {
//                      if(childs[x].type == 'cardHeader'){
//                          const node_data = await FlowCardData.findOne({
//                              where: {
//                                  "node_id" : childs[x].node_id,
//                              },
//                          });
//                          if (node_data) { 
//                              buttonData.push({ card: node_data }); 
//                          }
//                      }
//                      else{
//                          const node_data = await FlowButtonData.findOne({
//                              where: {
//                                  "node_id": childs[x].node_id,
//                              },
//                          });
//                          if (node_data) { 
//                              buttonData.push({ button: node_data }); 
//                          }
//                      }
//                  }
 
//                  intentData.push({ type: type, node_data: buttonData });
//              }
             
//          }
//          console.log("intentData",intentData);
//          res.json({ status: "success", intentData:intentData}) 
 
         
         
//      } catch (error) {
//      console.error('Error inserting data:', error);
//      }
//  };

export const getTargetData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sourceData: any[] = [];
        const targets = await Edge.findAll({
            where: {
                source: req.body.source,
            },
        });

        for (const singleTarget of targets) {
            const { target} = singleTarget;
            const target_node = await Node.findOne({ where: { node_id:target } });
            const type = target_node?.type;
            let data;

            switch (type) {
                case 'textOnly':
                    data = await FlowTextOnly.findOne({ where: { node_id:target_node?.node_id } });
                    break;
                case 'textinput':
                    data = await FlowTextBox.findOne({ where: { node_id:target_node?.node_id } });
                    break;
                case 'cardStyleOne':
                    data = await FlowCardData.findOne({ where: { node_id:target_node?.node_id } });
                    break;
                case 'buttonGroup': {
                    const buttons = await Node.findAll({ where: { parentId: target_node?.node_id } });
                    let buttonData = await Promise.all(buttons.map(async button => ({
                        button: await FlowButtonData.findOne({ where: { node_id: button.node_id } }),
                    })));
                    data = buttonData;
                    break;
                }
                case 'cardGroup': {
                    const childs = await Node.findAll({ where: { parentId: target_node?.node_id } });
                    let childData = await Promise.all(childs.map(async child => {
                        if (child.type === 'cardHeader') {
                            return { card: await FlowCardData.findOne({ where: { node_id: child.node_id } }) };
                        } else {
                            return { button: await FlowButtonData.findOne({ where: { node_id: child.node_id } }) };
                        }
                    }));
                    data = childData;
                    break;
                }
                default:
                    continue;
            }

            if (data) {
                sourceData.push({ type, source_data: data });
            }
        } 
        res.json({ status: "success", sourceData });
    } catch (error) {
        console.error('Error retrieving intent data:', error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
