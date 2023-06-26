const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');const express = require('express');
// Define route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, Glitch!");
});
// Define route for JotForm webhook
app.post("/jotform-webhook", upload.single("voicemail"), async (req, res) => {
  // Extract form data from JotForm submission
  const phoneNumber = req.body.input_3;
  const voicemailFile = req.file;

  // Perform any necessary validation on the form data

  // Call function to send RVM
  try {
    await sendRVM(phoneNumber, voicemailFile);
    res.status(200).json({ message: "RVM sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send RVM" });
  }
});

// Function to send RVM
async function sendRVM(phoneNumber, voicemailFile) {
  // Use Axios to make API request to send RVM
  const endpoint = "https://api.dropcowboy.com/v1/rvm"; // Replace with the actual API endpoint
  const url = endpoint;

  // Set request headers and parameters
  const headers = {
    "X-TeamID": "acb1088b-e24d-4c61-bb83-cfb335d71892",
    "X-SecretKey": "48db8265-f632-418b-b4f3-eb8c24aaef58",
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append("phone_number", phoneNumber);
  formData.append("recording_id", "4a57733e-30ab-43da-96a6-75e981e41fa9"); 
  
  // Make the API request
  const response = await axios.post(url, formData, { headers });

  // Handle the response as needed
  console.log("RVM sent:", response.data);
}
