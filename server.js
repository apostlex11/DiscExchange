const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const expressVisitorCounter = require('express-visitor-counter');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const { Cart, Listing } = require('./models');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const counters = {};

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.enable('trust proxy');
app.use(session(sess));
app.use(
  expressVisitorCounter({
    hook: (counterId) => (counters[counterId] = (counters[counterId] || 0) + 1),
  })
);


app.use((req, res, next) => {
  req.session.save(() => {
    req.session.counters = counters;
    next();
  });
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/success', (req, res) => {
  res.render('success');
})
app.get('/failed', (req, res) => {
  res.render('failed');
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [Listing], 
    });

    const totalPrice = cartItems.reduce((total, item) => total + item.listing.price, 0);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Items from your cart',
            },
            unit_amount: totalPrice * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/failed`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(routes);
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log('Server listening on: http://localhost:' + PORT)
  );
});