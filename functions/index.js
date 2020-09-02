const functions = require("firebase-functions");
const axios = require("axios");
const dayjs = require("dayjs");
const { db, runtimeOpts } = require("./util/db");

exports.updateGamesToday = functions
  .runWith(runtimeOpts)
  .pubsub //Every minute, every hour between 6am-12pm, of every day
  .schedule("* 6-12 * * *")
  .timeZone("Asia/Singapore")
  .onRun((context) => {
    const todayScoreboardApi = `https://data.nba.net/prod/v2/${dayjs()
      .subtract(1, "day")
      .format("YYYYMMDD")}/scoreboard.json`;

    return (
      axios
        .get(todayScoreboardApi)
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
