const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const body = JSON.parse(event.body || "{}");
    const quantity = Number(body.quantity || 0);

    if (!quantity || quantity < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Brak wybranych kategorii" })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: "Udział w LAMI CHAMPIONSHIP"
            },
            unit_amount: 20000
          },
          quantity
        }
      ],
      success_url: `${body.origin}/success.html`,
      cancel_url: `${body.origin}/cancel.html`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
