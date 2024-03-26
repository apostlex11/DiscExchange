const User = require('./User');
const Listing = require('./Listing');
const Cart = require('./Cart');
const Favorites = require('./Favorites');

User.hasMany(Listing, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Listing.belongsTo(User, {
  foreignKey: 'user_id',
});


User.hasMany(Favorites, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Favorites.belongsTo(User, {
  foreignKey: 'user_id',
});

Listing.hasMany(Favorites, {
  foreignKey: 'favitem_id',
  onDelete: 'CASCADE',
});

Favorites.belongsTo(Listing, {
  foreignKey: 'favitem_id',
});

User.hasMany(Cart, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Cart.belongsTo(User, {
  foreignKey: 'user_id',
});

Listing.hasMany(Cart, {
  foreignKey: 'cartitem_id',
  onDelete: 'CASCADE',
});

Cart.belongsTo(Listing, {
  foreignKey: 'cartitem_id',
});


module.exports = { User, Listing, Favorites,  Cart };
