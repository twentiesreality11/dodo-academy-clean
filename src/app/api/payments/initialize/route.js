const response = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: user.email,
    amount: amount,
    reference: reference,
    callback_url: callbackUrl,
    metadata: {
      user_id: user.id  // Important for webhook
    }
  }),
});