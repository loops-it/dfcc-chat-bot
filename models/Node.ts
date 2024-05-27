import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class Node extends Model {
  public id!: string;
  public node_id!: string;
  public dragging!: string;
  public height!: string;
  public position!: JSON;
  public positionAbsolute!: JSON;
  public selected!: string;
  public type!: string;
  public width!: string;
  public extent!: string;
  public parentId!: string;
  public intent!: string;
  public language!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Node.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    node_id: {
        type: new DataTypes.STRING(),
        allowNull: true,
      },
    dragging: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    height: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    position: {
        type: new DataTypes.JSON(),
        allowNull: true,
    },
    positionAbsolute: {
        type: new DataTypes.JSON(),
        allowNull: true,
    },
    selected: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    type: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    width: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    extent: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    parentId: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    intent:{
      type: new DataTypes.STRING(),
      allowNull: true,
  },
  language: {
    type: new DataTypes.STRING(),
    allowNull: true,
},
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'flow_nodes',
    modelName: 'Node',
  }
);

export default Node;
