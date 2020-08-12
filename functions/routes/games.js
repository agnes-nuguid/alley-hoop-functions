const { db } = require("../util/db");
const axios = require("axios");

exports.getTodayScoreboardLink = (req, res) => {
  return db
    .ref("/todayScoreboard")
    .once("value")
    .then(function (link) {
      return res.json(link);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.updateTodayScoreboardLink = async (req, res) => {
  try {
    //Gets the Today details
    const todayResponse = await axios.get(
      "https://data.nba.net/10s/prod/v4/today.json"
    );

    const todayScoreboard =
      "https://data.nba.net/10s" + todayResponse.data.links.todayScoreboard;

    return db.ref().update({ todayScoreboard }, function (error) {
      if (error) {
        res.json({ error: error });
      } else {
        res.json(`todayScoreboard updated to ${todayScoreboard} successfully`);
      }
    });
  } catch (e) {
    console.log("tryCatche", e);
    res.sendStatus(400);
  }
};
