const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const FormData = require('form-data');

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure JotForm API credentials
const jotformApiKey = "27f50030f5db987ecbf9f985f47076ec";
const jotformFormId = "231365209409051";
const jotformApiUrl = "https://api.jotform.com";

// Configure Drop Cowboy API credentials
const dropCowboyTeamId = "acb1088b-e24d-4c61-bb83-cfb335d71892";
const dropCowboySecretKey = "48db8265-f632-418b-b4f3-eb8c24aaef58";
const dropCowboyApiUrl = "https://api.dropcowboy.com/v1/rvm";

// Define route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, Glitch!");
});
// Define route for JotForm webhook
app.post("/jotform-webhook", async (req, res) => {
  // Extract form data from JotForm submission
  const phoneNumber = req.body.input_3;
  const recordingId = "4a57733e-30ab-43da-96a6-75e981e41fa9";

  // Perform any necessary validation on the form data

  // Call function to send RVM
  try {
    await sendRVM(phoneNumber, recordingId);
    res.status(200).json({ message: "RVM sent successfully" });
  } catch (error) {
    console.error("Error sending RVM:", error.message);
    res.status(500).json({ error: "Failed to send RVM" });
  }
});

// Function to send RVM
async function sendRVM(phoneNumber, recordingId) {
  // Use Axios to make API request to send RVM
  const url = dropCowboyApiUrl;

  // Set request headers and parameters
  const headers = {
    "X-TeamID": dropCowboyTeamId,
    "X-SecretKey": dropCowboySecretKey,
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append("phone_number", phoneNumber);
  formData.append("recording_id", recordingId); 
  
  // Make the API request
  const response = await axios.post(url, formData, {
    headers: formData.getHeaders(), // Use getHeaders() to retrieve the correct headers for FormData
    onUploadProgress: (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 100;
      console.log(`Upload progress: ${progress.toFixed(2)}%`);
    },
  });

  // Handle the response as needed
  console.log("RVM sent:", response.data);
}

// Start the server
const port = 10000; // You can change the port here if needed
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
