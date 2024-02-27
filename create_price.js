import stripe from 'stripe';

const stripeInstance = new stripe('sk_test_KUgd5hcMpYmUloBmiJ2W4h6S');

stripeInstance.products.create({
  name: 'Starter Subscription',
  description: '$12/Month subscription',
}).then(product => {
  stripeInstance.prices.create({
    unit_amount: 1200,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  }).then(price => {
    console.log('Success! Here is your starter subscription product id: ' + product.id);
    console.log('Success! Here is your starter subscription price id: ' + price.id);
  });
});
