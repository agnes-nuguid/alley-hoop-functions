const functions = require("firebase-functions");

const app = require("express")();

const {
  updateTodayScoreboardLink,
  updateGamesToday,
} = require("./routes/games");

app.put("/games/todayScoreboardLink", updateTodayScoreboardLink);
app.put("/games/today", updateGamesToday);

// Export base url with /api
// Use asia-east2 since Hong Kong is nearest
exports.api = functions.region("asia-east2").https.onRequest(app);
