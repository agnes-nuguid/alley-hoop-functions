const { db } = require("../util/db");

exports.getTodayScoreboardLink = (req, res) => {
  return db
    .ref("/todayScoreboard")
    .once("value")
    .then(function (link) {
      return res.json(link);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};
