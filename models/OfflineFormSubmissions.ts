import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class OfflineFormSubmissions extends Model {
  public id!: number;
  public chatId!: string;
  public name!: string;
  public email!: string;
  public subject!: string;
  public message!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

OfflineFormSubmissions.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    chatId: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    name: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    email: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    subject: {
        type: new DataTypes.STRING(),
        allowNull: true,
    },
    message: {
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
    tableName: 'offline_form_submissions',
    modelName: 'OfflineFormSubmissions',
  }
);

export default OfflineFormSubmissions;
