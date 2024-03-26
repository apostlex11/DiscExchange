const router = require('express').Router();
const userRoutes = require('./userRoutes');
const listingRoutes = require('./listingRoutes');
const cartRoutes = require('./cartRoutes');
const favoritesRoutes = require('./favoritesRoutes');


router.use('/users', userRoutes);
router.use('/listings', listingRoutes);
router.use('/cart', cartRoutes);
router.use('/favorites', favoritesRoutes);


module.exports = router;
