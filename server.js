const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const path = require("path"); // Import the path module
const keepAlive = require('express-keep-alive');

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Configure JotForm API credentials
const jotformApiKey = "27f50030f5db987ecbf9f985f47076ec";
const jotformFormId = "231094222617046";
const jotformApiUrl = "https://api.jotform.com";

// Configure Drop Cowboy API credentials
const dropCowboyTeamId = "acb1088b-e24d-4c61-bb83-cfb335d71892";
const dropCowboySecretKey = "48db8265-f632-418b-b4f3-eb8c24aaef58";
const dropCowboyApiUrl = "https://api.dropcowboy.com/v1/rvm";

// Use keep-alive middleware to keep the deploy active
app.use(keepAlive({
  ttl: 60, // 1 minute
}));

// Define route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, Glitch!");
});

// Define route for JotForm webhook
app.post("/jotform-webhook", async (req, res) => {
  // Log the received form data and files for debugging
  console.log('Received form data:', req.body);
  
  // Extract form data from JotForm submission
  const phoneNumber = req.body["input_3"];
  const recordingId = "4a57733e-30ab-43da-96a6-75e981e41fa9";

  // Call the sendRVM function and store the result
  const result = await sendRVM(phoneNumber, recordingId);

  // Check if the RVM was sent successfully
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    console.error("Error sending RVM:", result.message);
    res.status(500).json({ error: "Failed to send RVM", details: result.message });
  }
});
  
// Perform any necessary validation on the form data

// Function to send RVM
async function sendRVM(phoneNumber, recordingId) {
  // Form the complete phone number in E.164 format (assuming the first 3 digits are the area code)
  const phone_number_with_area_code = `+1${phoneNumber}`;
  
  // Use Axios to make API request to send RVM
  const url = dropCowboyApiUrl;

  // Set request headers and parameters
  const headers = {
    "X-TeamID": dropCowboyTeamId,
    "X-SecretKey": dropCowboySecretKey,
    "Content-Type": "application/json",
  };
  const payload = {
    team_id: dropCowboyTeamId,
    secret: dropCowboySecretKey,
    phone_number: phone_number_with_area_code,
    recording_id: recordingId,
    branding_id: "fae66130-e5a1-4254-ba19-53971fc55df1",
    foreign_id: "my_unique_foreign_id", // Replace with your system's ID
  };

  try {
    const response = await axios.post(url, payload, { headers: headers });
    console.log("RVM sent:", response.data);

    // If successful, return a success message
    return { success: true, message: "RVM sent successfully" };
  } catch (error) {
    console.error("Error sending RVM:", error.message);

    // If an error occurs, return an error message
    return { success: false, message: error.message };
  }
}

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
