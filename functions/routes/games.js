const { db } = require("../util/db");
const axios = require("axios");

// Today Scoreboard
const getTodayScoreboardLink = (req, res) => {
  return db
    .ref("/todayScoreboard")
    .once("value")
    .then(function (snapshot) {
      return snapshot.val();
    })
    .catch((err) => {
      console.error("getTodayScoreboardLink ERROR", err);
      res.status(500).json({ error: err.code });
    });
};

// Game Today
exports.updateGamesToday = async (req, res) => {
  try {
    // Gets the todayScoreboardLink details
    const todayScoreboardLink = await getTodayScoreboardLink();

    // Gets the today's games
    const gamesResponse = await axios.get(todayScoreboardLink);

    // // Filters only needed data
    const gamesToday = gamesResponse.data.games.map((game) => {
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

    // Updates to firebase realtime database
    return db.ref().update({ gamesToday }, function (error) {
      if (error) {
        return res.json({ error: error });
      } else {
        return res.json({
          status: "gamesToday updated successfully",
          gamesToday,
        });
      }
    });
  } catch (e) {
    console.log("updateGamesToday ERROR", e);
    res.sendStatus(400);
  }
};
