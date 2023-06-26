const express = require('express');
const app = express();

// Import your routes
const jotformWebhookRoute = require('./index');

// Configure middleware
app.use(express.json());

// Set up routes
app.use('/jotform-webhook', jotformWebhookRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
