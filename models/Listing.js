const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Listing extends Model {}

Listing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    album_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM('CD', 'vinyl', 'cassette'),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cover_art: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.ENUM('New', 'Good', 'Fair'),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'listing',
  }
);

module.exports = Listing;
