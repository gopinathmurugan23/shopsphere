const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/checkout
// @access  Private
exports.createCheckoutSession = async (req, res) => {
    const { cartItems } = req.body;

    try {
        const line_items = cartItems.map((item) => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name,
                        images: [item.image],
                        description: item.description,
                    },
                    unit_amount: item.price * 100, // Stripe expects amounts in cents
                },
                quantity: item.qty,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: req.user.email,
            billing_address_collection: 'required',
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: 'Error creating checkout session' });
    }
};
