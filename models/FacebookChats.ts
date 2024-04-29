import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class FacebookChats extends Model {
  public id!: number;
  public sender_id!: string;
  public message_sent_by!: string;
  public message!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

FacebookChats.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
    message_sent_by: {
        type: new DataTypes.STRING(),
        allowNull: false,
    },
    message: {
      type: new DataTypes.STRING(),
      allowNull: false,
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
    tableName: 'facebook_chats',
    modelName: 'FacebookChats',
  }
);

export default FacebookChats;
