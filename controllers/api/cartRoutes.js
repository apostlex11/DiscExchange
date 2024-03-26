const router = require('express').Router();
const { Cart } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, async (req, res) => {
    try {
        const cartData = await Cart.create({
            cartitem_id: req.body.id,
            user_id: req.session.user_id,
        });
        console.log(cartData);
        res.status(200).json(cartData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const cartData = await Cart.destroy({
            where: {
                cartitem_id: req.body.id,
                user_id: req.session.user_id,
            },
        });

        if (!cartData) {
            res.status(400).json({
                message: 'No cart item found with this ID!'
            });
            return;
        } else {
            res.json({
                message: 'Cart item successfully deleted!'
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;