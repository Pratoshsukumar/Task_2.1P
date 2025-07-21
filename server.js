const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Welcome to Dev@Deakin!',
    text: `Hi there! Thanks for subscribing to Dev@Deakin.`,
    html: `<strong>Welcome to Dev@Deakin!</strong><p>We're glad to have you on board.</p>`,
  };

  try {
    await sgMail.send(msg);
    res.send(`<h2>Welcome email sent successfully to ${email}!</h2>`);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email. Try again later.');
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
