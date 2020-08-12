const functions = require("firebase-functions");

const app = require("express")();

const {
  getTodayScoreboardLink,
  updateTodayScoreboardLink,
} = require("./routes/games");

app.get("/games/todayScoreboardLink", getTodayScoreboardLink);
app.put("/games/todayScoreboardLink", updateTodayScoreboardLink);

// Export base url with /api
// Use asia-east2 since Hong Kong is nearest
exports.api = functions.region("asia-east2").https.onRequest(app);
