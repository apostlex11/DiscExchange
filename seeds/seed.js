const sequelize = require('../config/connection');
const { User, Listing } = require('../models');

const userData = require('./userData.json');
const listingData = require('./listingData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const listing of listingData) {
    await Listing.create({
      ...listing,
    });
  }

  process.exit(0);
};

seedDatabase();