// backend/models/wishlistItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
  // userId and productId are now added automatically by the associations
});

module.exports = WishlistItem;