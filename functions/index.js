const functions = require("firebase-functions");
const axios = require("axios");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.stableDiffusion = functions.https.onRequest(
  async (request, response) => {
    axios
      .post("https://35.209.131.22:5000/api/", {
        prompt: "hello",
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error;
      });
  }
);
