import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class FlowCardData extends Model {
  public id!: string;
  public node_id!: string;
  public title!: string;
  public description!: string;
  public image!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

FlowCardData.init(
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
    title: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    description: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    image: {
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
    tableName: 'flow_card_data',
    modelName: 'FlowCardData',
  }
);

export default FlowCardData;
