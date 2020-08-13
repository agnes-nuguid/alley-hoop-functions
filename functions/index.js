const functions = require("firebase-functions");
const axios = require("axios");
const { db } = require("./util/db");
const app = require("express")();

//const { updateGamesToday } = require("./routes/games");

exports.updateTodayScoreboardLink = functions.pubsub
  .schedule("01 00 * * *")
  .timeZone("Asia/Singapore")
  .onRun((context) => {
    return (
      axios
        // Gets the Today details
        .get("https://data.nba.net/10s/prod/v4/today.json")
        // Returns todayScoreboardLink
        .then((todayResponse) => {
          return (
            "https://data.nba.net/10s" +
            todayResponse.data.links.todayScoreboard
          );
        })
        // Updates todayScoreboard in the Realtime Database
        .then((todayScoreboard) => {
          return db.ref().update({ todayScoreboard }, function (error) {
            if (error) {
              return { error: error };
            } else {
              return {
                res: `todayScoreboard updated to ${todayScoreboard} successfully`,
              };
            }
          });
        })
    );
  });

//app.put("/games/today", updateGamesToday);

// Export base url with /api
// Use asia-east2 since Hong Kong is nearest
//exports.api = functions.region("asia-east2").https.onRequest(app);
