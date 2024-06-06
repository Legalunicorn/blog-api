var express = require('express');
var router = express.Router();
const articleController = require("../controllers/articleController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/articles");
});

module.exports = router;
