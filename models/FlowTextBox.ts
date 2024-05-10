import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class FlowTextBox extends Model {
  public id!: string;
  public node_id!: string;
  public title!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

FlowTextBox.init(
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
    tableName: 'flow_text_box',
    modelName: 'FlowTextBox',
  }
);

export default FlowTextBox;
