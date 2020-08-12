const functions = require("firebase-functions");

const app = require("express")();

const { getTodayScoreboardLink } = require("./routes/games");

app.get("/games/todayScoreboardLink", getTodayScoreboardLink);

// Export base url with /api
// Use asia-east2 since Hong Kong is nearest
exports.api = functions.region("asia-east2").https.onRequest(app);
