const router = require('express').Router();
const { User, Listing, Favorites, FavItem, Cart, CartItem } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const dbListingData = await Listing.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Favorites,
        },
        {
          model: Cart,
        },
      ],
    });


    const listings = dbListingData.map((listing) =>
      listing.get({ plain: true })
    );

    console.log('ID', req.session.user_id);
    res.render('homepage', {
      listings,
      logged_in: req.session.logged_in,
      userId: req.session.user_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/user/:id', withAuth, async (req, res) => {
  
  try {
    const userListingData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Listing,
        },
      ],
      attributes: ['id', 'name']
    });

    const userListings = userListingData.listings.map((listing) => listing.get({ plain: true }));
    console.log(userListings);

    res.render('single-user', {
      userListings,
      logged_in: req.session.logged_in,
      user: userListingData.dataValues,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/listing/:id', withAuth, async (req, res) => {
  try {
    const dbListingData = await Listing.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const listing = dbListingData.get({ plain: true });
    console.log(listing);

    res.render('single-listing', {
      listing,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/listing', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk( req.session.user_id, {
      attributes: ["id", "name"]
    });
    res.render('listing', {
      logged_in: req.session.logged_in,
      user: userData.dataValues,
    });
  } catch(err) {}
});
  

router.post('/listings', withAuth, async (req, res) => {
  try {
    const listingData = await Listing.create({
      ...req.body,
      logged_in: req.session.logged_in,
    });

    const newListing = listingData.get({ plain: true });
    console.log(newListing);

    res.render('single-listing', {
      newListing,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/vinyls', withAuth, async (req, res) => {
  try {
    const vinylData = await Listing.findAll({
      where: {
        format: 'vinyl',
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const vinyls = vinylData.map((listing) => listing.get({ plain: true }));
    console.log(vinyls);

    res.render('vinyls', {
      vinyls,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/cds', withAuth, async (req, res) => {
  try {
    const cdData = await Listing.findAll({
      where: {
        format: 'CD',
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const cds = cdData.map((listing) => listing.get({ plain: true }));
    console.log(cds);

    res.render('cds', {
      cds,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/cassettes', withAuth, async (req, res) => {
  try {
    const cassetteData = await Listing.findAll({
      where: {
        format: 'cassette',
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const cassettes = cassetteData.map((listing) =>
      listing.get({ plain: true })
    );
    console.log(cassettes);

    res.render('cassettes', {
      cassettes,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/profile', withAuth, async (req, res) => {
  try {
    const userListingData = await User.findByPk(req.session.user_id, {
      include: [
        {
          model: Listing,
        },
      ],
      attributes: ['id', 'name']
    });

    const listingData = userListingData.listings.map((listing) => listing.get({ plain: true }));
    console.log(listingData);

    res.render('profile', {
      listingData,
      logged_in: req.session.logged_in,
      user: userListingData.dataValues,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});


router.get('/myitems', withAuth, async (req, res) => {
  try {
    const favItemsData = await Favorites.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Listing,
          include: [User],
        }
      ],
    });

    const favItems = favItemsData.map((item) => {
      return item.get({ plain: true });
    });

    console.log(JSON.stringify(favItems, null, 4));

    res.render('myitems', {
      favItems,
      logged_in: req.session.logged_in,
      favquantity: favItems.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/mycart', withAuth, async (req, res) => {
  try {
    const cartItemsData = await Cart.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Listing,
          include: [User],
        }
      ],
    });

    let sum = 0

    const cartItems = cartItemsData.map((item) => {
      const result = item.get({ plain: true });
      sum += result.listing.price
      return result;
    });
    console.log(cartItems);

    res.render('mycart', {
      cartItems,
      logged_in: req.session.logged_in,
      cartquantity: cartItems.length,
      subtotal: sum,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
