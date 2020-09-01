const functions = require("firebase-functions");
const axios = require("axios");
const { db, runtimeOpts } = require("./util/db");

exports.updateTodayScoreboardApi = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("01 00 * * *")
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
        // Updates todayScoreboardApi in the Realtime Database
        .then((todayScoreboardApi) => {
          return db.ref().update({ todayScoreboardApi });
        })
    );
  });

exports.updateGamesToday = functions
  .runWith(runtimeOpts)
  .pubsub //Every minute, every hour between 6am-12pm, of every day
  .schedule("* 6-12 * * *")
  .timeZone("Asia/Singapore")
  .onRun((context) => {
    return (
      db
        .ref("/todayScoreboardApi")
        .once("value")
        // Gets the todayScoreboardApi from db
        .then((snapshot) => {
          return snapshot.val();
        })
        // Gets today games from todayScoreboardApi
        .then((todayScoreboardApi) => {
          return axios.get(todayScoreboardApi);
        })
        // Filters only needed games data
        .then((gamesResponse) => {
          return gamesResponse.data.games.map((game) => {
            const filteredGame = (({
              clock,
              gameId,
              isGameActivated,
              period,
              hTeam: { score, triCode },
              startTimeUTC,
            }) => ({
              clock,
              gameId,
              isGameActivated,
              period,
              hTeam: { score, triCode },
              startTimeUTC,
            }))(game);

            // Deconstructs subset of vTeam (gets duplicate error if used with hTeam due to 'score')
            const v = (({ vTeam: { score, triCode } }) => ({
              vTeam: { score, triCode },
            }))(game);

            filteredGame.vTeam = v.vTeam;
            delete filteredGame.period.type;

            return filteredGame;
          });
        })
        // Updates filtered gamesToday in the Realtime Database
        .then((gamesToday) => {
          return db.ref().update({ gamesToday });
        })
    );
  });
