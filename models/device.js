'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.belongsTo(models.User, {
        foreignKey: "id",
        as: "users",
      });
    }
  }
  Device.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    browser_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    browser_version: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    os_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    os_version: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Device',
    tableName: "devices",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Device;
};