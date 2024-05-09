import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class Edge extends Model {
  public id!: string;
  public edge_id!: string;
  public source!: string;
  public sourceHandle!: string;
  public target!: string;
  public targetHandle!: string;
  public type!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Edge.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    edge_id: {
        type: new DataTypes.STRING(),
        allowNull: true,
      },
    source: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    sourceHandle: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    target: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    targetHandle: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    type: {
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
    tableName: 'edges',
    modelName: 'Edge',
  }
);

export default Edge;
