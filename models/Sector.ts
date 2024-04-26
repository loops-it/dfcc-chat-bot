import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class Sector extends Model {
  public id!: number;
  public sector_name!: string;
  public email!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Sector.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sector_name: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    email: {
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
    tableName: 'sectors',
    modelName: 'Sector',
  }
);

export default Sector;
