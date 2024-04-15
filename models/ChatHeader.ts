import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class ChatHeader extends Model {
  public id!: number;
  public message_id!: string;
  public agent!: string;
  public language!: string;
  public rating!: string;
  public feedback!: string;
  public status!: string;
}

ChatHeader.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    message_id: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
    agent: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    language: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    rating: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
    feedback: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
    status: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
  },
  {
    sequelize,
    tableName: 'live_agent_chat_header',
    modelName: 'ChatHeader',
  }
);

export default ChatHeader;
