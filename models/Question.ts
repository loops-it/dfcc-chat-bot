import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class Question extends Model {
  public id!: number;
  public question!: string;
  public intent!: string;
  public language!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    intent: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    language: {
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
    tableName: 'questions',
    modelName: 'Question',
  }
);

export default Question;
