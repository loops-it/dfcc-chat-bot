import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class FlowButtonData extends Model {
  public id!: string;
  public node_id!: string;
  public text!: string;
  public link!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

FlowButtonData.init(
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
    link: {
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
    tableName: 'flow_button_data',
    modelName: 'FlowButtonData',
  }
);

export default FlowButtonData;
