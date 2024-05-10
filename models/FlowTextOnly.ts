import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class FlowTextOnly extends Model {
  public id!: string;
  public node_id!: string;
  public text!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

FlowTextOnly.init(
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
    text: {
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
    tableName: 'flow_text_only',
    modelName: 'FlowTextOnly',
  }
);

export default FlowTextOnly;
